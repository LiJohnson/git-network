var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var exec = require('child_process').exec;
var Gitter = require("./git-graph.js");

var repo = "/home/lcs/Desktop/omxplayer-web-ui"

var git = new Gitter(repo);

app.get("/",function(req,res){	
	var file = __dirname + "/network.html";
	res.sendFile(file);
});

app.get("/:file",function(req,res){	
	var file = __dirname + "/" + req.params.file;
	res.sendFile(file);
});

app.get("/static/*",function(req,res){
	var file = __dirname + "/lib" + req._parsedUrl.pathname.replace(/^\/?static/,'');
	//console.log(file);
	res.sendFile(file);
});

app.get("/git/*",function(req,res){
	var file = __dirname + "/";
	if(req._parsedUrl.path.match(/meta/)){
		file += "meta.js";
		git.githubMeta(function(meta){
			res.send(meta);
		});
	}else{
		git.githubCommit(function(commit){
			res.send(commit);
		});
		file += "commit.js";
	}
	//res.sendFile(file);
});

io.on("connection",function(socket){
	socket.emit("control",control);
	socket.on("control",function(action){
		handleControl(action);
	});
});


server.listen(9696,function(){
	console.log("listening ",9696);
});