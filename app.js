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
	res.sendFile(__dirname + "/deploy.html");
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
	}).on("deploy",function(data){
        if( data.repo ){
            git = new Gitter(data.repo);
        }
        if( !data.hash )return;
		var pro = git.deploy("./shell/deploy.sh",data.hash,function(data){
			console.log(data);
		});
        pro.stdout.on("data",function(data){
			socket.emit("console",data);
		});
        pro.stderr.on("data",function(data){
			socket.emit("console",data);
		});
	}).on('change-repo',function(repo){
        git = new Gitter(repo);
        git.branch( function(arr){
            socket.emit('change-repo',arr);
        });
    }).on('tail-log',function(project){
        var map = {
            PC:'/data2/projects/ycp/tomcat3/logs/catalina.out',
            APP:'/data2/projects/app/tomcat3/logs/catalina.out'
        };
        map[project] && git.run('tail',['-f',map[project]],function(data){
            socket.emit('tail-log',data);
        })
    });
});


server.listen(9696,function(){
	console.log("listening ",9696);
});