var exec = require("child_process").exec;
var fs = require("fs");

var repo = "/home/lcs/github/MyPHP";
var repo = "/media/lcs/lcs/bitbucket/CarBar";


var Gitter = function(repo){
	var $this = this;
	var git = function(cmd , cb , err){
		return exec( "git " + cmd ,{cwd:repo} , function(err,stdout,stderr){
			if( err || stderr ){
				console.log(err,stderr);
				err && err.call($this,err,stderr);
			}else{
				cb.call($this,stdout);
			}
		});
	};

	this.graph = function(cb){
		if(!cb) throw "need a callback function";

		var cmd = "log --all --branches --date-order --graph --pretty=format:'" ;
		cmd += '##{"hash":"%h" , "parents":"%p" , "head":"%d", "name":"%an" , "email": "%ae" , "message" : "%s" ,"datetime" :"%ad"}'
		cmd += "'";

		return git(cmd,function(stdout){
			//fs.writeFile("/tmp/git.log",stdout);
			var data = [];
			var map = {};
			stdout.split("\n").forEach(function(line,i){
				line = line.split('##');
				if( line[1] ){
					line[1] =  JSON.parse(line[1].replace(/\s/g,' '));
					line[1].time = i;
					line[1].space = line[0].indexOf("*");
					line[1].parents = line[1].parents ? line[1].parents.split(/\s/) : [];
					map[line[1].hash] = line[1];
				}
				data.push({graph:line[0],commit: line[1]});
			});

			data.forEach(function(line){
				if(!line.commit)return;
				for ( var i = 0 ; i < line.commit.parents.length ; i++){
					var parent = map[line.commit.parents[i]];
					line.commit.parents[i] = [parent.hash , parent.time,parent.space];
				}
			});
			cb.call($this,data);
		});
	};

	this.gitNetWork = function(cb){

	};

};

var g = new Gitter(repo);
g.graph(function(data){
	console.log(data);
});

