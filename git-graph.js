var exec = require("child_process").exec;
var fs = require("fs");

var repo = "/home/lcs/github/MyPHP";
var repo = "/media/lcs/lcs/bitbucket/CarBar";
var repo = "/home/lcs/github/omxplayer-web-ui"

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

var shortDate = function(dateStr){
	new Date(dateStr);
}

var Gitter = function(repo){
	var $this = this;
	var git = function(cmd , cb , err){
		console.log("cmd git " + cmd);
		return exec( "git " + cmd ,{cwd:repo} , function(err,stdout,stderr){
			if( err || stderr ){
				console.log(err,stderr);
				err && err.call($this,err,stderr);
			}else{
				cb.call($this,stdout);
			}
		});
	};
	
	this.repoName = repo.split('/').pop();

	this.graph = function(cb,orderDesc){
		if(!cb) throw "need a callback function";

		var cmd = "log --all --branches --date-order --graph --pretty=format:'" ;
		cmd += '##{"hash":"%h" , "parents":"%p" , "head":"%d", "name":"%an" , "email": "%ae" , "message" : "%s" ,"datetime" :"%ad"}'
		cmd += "'";

		return git(cmd,function(stdout){
			//fs.writeFile("/tmp/git.log",stdout);
			var data = [];
			var map = {};
			stdout = stdout.split("\n");
			stdout = orderDesc ? stdout.reverse() : stdout;

			stdout.forEach(function(line,i){
				line = line.split('##');
				if( line[1] ){
					line[1] =  JSON.parse(line[1].replace(/\s/g,' '));
					line[1].space = line[0].indexOf("*");
					line[1].parents = line[1].parents ? line[1].parents.split(/\s/) : [];
					line[1].head = line[1].head.replace(/(^\s*\()|(\)\s*$)/g,'');
					map[line[1].hash] = line[1];
				}
				data.push({graph:line[0],data: line[1]});
			});

			data.forEach(function(line){
				if(!line.data)return;
				for ( var i = 0 ; i < line.data.parents.length ; i++){
					var parent = map[line.data.parents[i]];
					line.data.parents[i] = [parent.hash , parent.time,parent.space];
				}
			});
			cb.call($this,data);
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
			data.forEach(function(commit){
				if( !commit.data )return;
				meta.dates.push(new Date(commit.data.datetime).format())

				if(!commit.data.head)return;
				meta.users[0].heads.push({name:commit.data.head,id:commit.data.hash})
				meta.spacemap.push([]);
			});
			meta.blocks[0].count = meta.spacemap.length;
			meta.focus = meta.dates.length;
			cb.call(this,meta);
		},true);
	};

	this.githubCommit = function(cb){
		var commits = []
		this.graph(function(data){
			var time = 0;
			data.forEach(function(commit){
				commit = commit.data
				if( !commit )return;
				commit.id = commit.hash;
				commit.time = time++;
				commit.author = commit.login = commit.name;
				commit.date = new Date(commit.datetime).format("y-m-d h:M:s");
				commit.gravatar = commit.email;
				commit.head = commit.head.replace(/,/g,"\n");

				commits.push(commit);
			});
			cb.call(this,{commits:commits});
		},true);
	};

};

module.exports = Gitter;
/*var g = new Gitter(repo);
g.githubCommit(function(data){
	console.log(data);
});
*/
