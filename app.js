var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var exec = require('child_process').exec;
var Gitter = require("./git-graph.js");

var repo = '/tmp';

var git = new Gitter(repo);

var repoPath = require("./repo-path");

app.get("/test",function(req,res){
	r(".",function(data){ 
		console.log(data) 
		res.send(data);
	});
});

app.get("/",function(req,res){	
	var file = __dirname + "/network.html";
	res.sendFile(file);
});

app.get("/highcharts",function(req,res){
	res.sendFile(__dirname + "/highcharts.html" );
});

app.get("/highcharts/commits",function(req,res){
	git.highcharts(function(data){
		res.send(data);
	});
});

app.get("/:file",function(req,res){	
	var file = __dirname + "/" + req.params.file;
	res.sendFile(file);
});

app.get("/static/*",function(req,res){
	var file = __dirname + "/lib" + req._parsedUrl.pathname.replace(/^\/?static/,'');
	res.sendFile(file);
});

app.get("/git/*",function(req,res){
	var file = __dirname + "/";
	if(req._parsedUrl.path.match(/meta/)){
		git.githubMeta(function(meta){
			res.send(meta);
		});
	}else{
		git.githubCommit(function(commit){
			res.send(commit);
		});
	}
});

app.get("/:repo/:name/:commit/:hash",function(req,res){
	git.deploy( req.params.hash , function(data){
		res.send(data);
	})
});

io.on("connection",function(socket){
	socket.on("path",function(data){
		try{
			repoPath(data.path,function(results){
				socket.emit("path",{path:data.path,data:results});
			});
		}catch(e){
			socket.emit("path-errr",e);
		}
	}).on("git",function(data){
		git = new Gitter(data.repo);
	}).on("repo",function(){
		socket.emit("repo",{repo:git.getRepo()});
	});
});


server.listen(9696,function(){
	console.log("listening ",9696);
});