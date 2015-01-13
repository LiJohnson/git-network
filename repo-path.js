'use stitck';

var fs = require("fs");
var readRepo = function( path , cb , depth , results){
	var filePath , realPath , isGit , stat , data;
	
	depth = depth || 0;
	path = path.replace(/\/$/,'') + '/';
	results = results ||  [];
	data = fs.readdirSync(path);

	if(!data) return cb.call(this,results);

	data.forEach(function(name){
		if( /^\./.test(name) )return;

		filePath = path + name;
		stat = fs.statSync(filePath);
		
		if( stat.isDirectory() ){
			isGit = fs.existsSync(filePath + "/.git");
			realPath = fs.realpathSync(filePath);
			results.push({path:filePath , isGit:isGit , realPath : realPath });
		}
	});

	if( results.length < 10 && depth < 3 ){
		results.forEach(function(pathData){
			readRepo(pathData.path , cb , depth+1 , results)
		});
	}else{
		cb.call(this,results)
	}
};

module.exports = readRepo;

