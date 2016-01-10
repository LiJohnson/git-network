var Gitter = require("../git-graph.js");

var git = new Gitter("/Users/lcs/github/git-network/");

git.branch(function(data){
    console.log(data);
}).logDetial("master",function(data){
   // console.log(data);
});