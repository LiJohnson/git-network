var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
var fs = require("fs");
var md5 = require("md5");

Date.prototype.format = function(foramt){
	foramt = foramt || "y-m-d";

	var d = {
		y:this.getFullYear(),
		m:this.getMonth()+1,
		d:this.getDate(),
		h:this.getHours(),
		M:this.getMinutes(),
		s:this.getSeconds()
	}
	for( var i in d ){
		foramt = foramt.replace(i,d[i] < 10 ? "0" + d[i] : d[i]);
	}
	return foramt;
}


var Gitter = function(repo){
	var $this = this;
	var run = function(cmd,params,cb,errcb){
		var buf = new Buffer("");
		var process = spawn(cmd,params,{cwd:repo});
		process.stdout.on("data",function(data){
			buf = Buffer.concat([buf,data]);
		});

		process.stderr.on("data",function(data){
			buf = Buffer.concat([buf,data]);
		});

		process.on("close",function(code){
			cb = code == 0 ? cb : errcb||function(){};
			console.log("code " , code);
			cb.call($this,buf.toString(),buf);
		});

		process.on("error",function(error){
			console.log(error);
		});
		
		return process;
	};

	var git = function(cmd , cb , errcb){
		cmd = Array.isArray(cmd) ? cmd : cmd.trim().split(" ");
		console.log("cmd git " , cmd);
		return run("git",cmd,cb,errcb);
	};

	var gravatar = (function(){
		var cache = {};
		return function(email){
			if( !cache[email] ){
				cache[email] = "http://gravatar.com/avatar/#?size=48".replace("#",md5.digest_s(email));
			}
			return cache[email];
		}
	})();
	
	this.repoName = repo.split('/').pop();

	this.getRepo = function(){
		return repo;
	}

	this.graph = function(cb,orderDesc){
		if(!cb) throw "need a callback function";

		var cmd = "log --all --branches --date-order --graph".split(" ");
		cmd.push("--pretty=format:'"  
				+'##{"hash":"%h" , "parents":"%p" , "head":"%d", "name":"%an" , "email": "%ae"  ,"datetime" :"%ad" } #message# %s'
				+"'");

		return git(cmd,function(stdout){
			//fs.writeFile("/tmp/git.log",stdout);
			var data = [];
			var map = {};
			stdout = stdout.split("\n");
			stdout = orderDesc ? stdout.reverse() : stdout;

			stdout.forEach(function(line,i){
				line = line.split('##');
				if( line[1] ){
					var tmp = line[1].split("#message#");
				
					line[1] =  JSON.parse(tmp[0]);
					line[1].message = tmp[1];
					
					line[1].parents = line[1].parents ? line[1].parents.split(/\s/) : [];
					line[1].head = line[1].head.replace(/(^\s*\()|(\)\s*$)/g,'');
					map[line[1].hash] = line[1];
				}
				data.push({graph:line[0],data: line[1]});
			});

			cb.call($this,data,map);
		},function(error){
			console.log(error);
		});
	};

	this.githubMeta = function(cb){
		var meta = {
			users:[{
				name:this.repoName,
				repo:this.repoName,
				heads:[]
			}],
			blocks:[{
				name:this.repoName,
				start:0,
				count:0
			}],
			dates:[],
			spacemap:[],
			focus:0,
			nethash:'nethash'

		};

		this.graph(function(data){
			var maxSpace = 1 , space;
			data.forEach(function(commit){
				if( !commit.data )return;
				space = commit.graph.indexOf("*");
				maxSpace = Math.max(maxSpace,space);

				meta.dates.push(new Date(commit.data.datetime).format())

				if(!commit.data.head)return;
				meta.users[0].heads.push({name:commit.data.head,id:commit.data.hash})
			});
			
			while(maxSpace > 0 ){
				meta.spacemap.push([]);
				maxSpace--;
			}

			meta.blocks[0].count = meta.spacemap.length;
			meta.focus = meta.dates.length;
			
			cb.call(this,meta);
		},true);
	};

	this.githubCommit = function(cb){
		var commits = []
		this.graph(function(data){
			var time = 0;
			var map = {};	

			data.forEach(function(logInfo){
				var commit = logInfo.data
				if( !commit )return;
				commit.id = commit.hash;
				commit.time = time++;
				commit.author = commit.login = commit.name;
				commit.date = new Date(commit.datetime).format("y-m-d h:M:s");
				commit.gravatar = gravatar(commit.email);
				commit.head = commit.head.replace(/,/g,"<br>\n");
				commit.space = logInfo.graph.indexOf("*")/2;
				
				map[commit.hash] = commit;

				commits.push(commit);
			});

			commits.forEach(function(commit){
				for( var i = 0 , parent ; i < commit.parents.length ; i++ ){
					parent = map[commit.parents[i]];
					commit.parents[i] = [parent.hash,parent.time,parent.space];
				}
			});
			cb.call(this,{commits:commits});
		},true);
	};

	this.commits = function(cb){
		this.graph(function(data){
			var x = 0;
			var commits = [];
			var map = {};

			data.forEach(function(logInfo){
				var commit = logInfo.data
				if( !commit )return;
				commit.x = x++;
				commit.y = logInfo.graph.indexOf("*");
				commit.datetime = new Date(commit.datetime);
				commit.gravatar = gravatar(commit.email);
				commit.heads = !commit.head ? [] :commit.head.split(',');

				commit.parentsHash = commit.parents;
				commit.children = [];
				commit.parents = [];

				commits.push(commit);
				map[commit.hash] = commit;
			});

			commits.forEach(function(commit){
				for( var i = 0 , parent ; i < commit.parentsHash.length ; i++ ){
					parent = map[commit.parentsHash[i]];
					commit.parents.push(parent);
					//parent.children.push(commit);
				}
			});
			cb.call(this,commits);
		},true);
	};
	
	this.highcharts = function(cb){
		this.commits(function(commits){
			var lines = [];
			var  points = [];
			commits.forEach(function(commit){
				commit.parents.forEach(function(parent){
					lines.push([[commit.x,commit.y],[parent.x,parent.y]]);
				});
				points.push([commit.datetime*1,commit.y]);
				delete commit.parents;
			});
			cb.call(this,{lines:lines,commits:commits,points:points});
		});
	};

	this.logDetial = function(hash , cb){
		git(" log -n 1 -p --color " + hash , function(str,buf){
			try{
				var p = run("ansi2html",[],cb,cb);
				p.stdin.write(buf);
				p.stdin.end();
			}catch(e){
				cb.call($this,"<pre>"+buf.toString());
			}
		},function(error){
			console.log(error)
		});
	};

	this.deploy = function( script , hash , cb){
		run("bash" ,[ script ,hash],function(str,buf){
			try{
				var p = run("ansi2html",[],cb,cb);
				p.stdin.write(buf);
				p.stdin.end();
			}catch(e){
				cb.call($this,"<pre>"+buf.toString());
			}
		},cb);
	};
};

module.exports = Gitter;
/*
var g = new Gitter(repo);
g.highcharts(function(data){
	console.log(data);
	//JSON.stringify(data);
	//fs.writeFile("/tmp/git.json",JSON.stringify(data));
});
*/
