var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

app.use(express.static('icons'));
const Filehound = require('filehound');

// app.get('/list',function(req,res){
// Filehound.create()
//  .depth(1)
//   .path("icons")
//   .directory()
//   .find((err, subdirectories) => {
//     if (err) return console.error(err);
//     res.json({subdirectories});
//   });
// });

const dirTree = require('directory-tree');

app.get('/category',function(req,res){ 
    
    var categoryname = req.query.categoryname;
    var iconname = req.query.iconname;
    if(categoryname) console.log(categoryname);
    if(iconname) console.log(iconname);

    var currentDirPath = path.resolve(__dirname)+'/icons'
    if(categoryname && iconname)
        currentDirPath = path.resolve(__dirname)+'/icons/' + iconname +'/'+ categoryname;

    console.log(currentDirPath);
    const tree = dirTree(currentDirPath, {extensions:/\.svg/});
    res.json(tree);
});

// app.get('/category/{{}}',function(req,res){ 
//     const tree = dirTree(path.resolve(__dirname)+'/icons', {extensions:/\.svg/});
//     res.json(tree);
// });


app.get('/category1',function(req,res){
    var dirTree = (path.resolve(__dirname)+'/icons');    
diretoryTreeToObj(dirTree, function(err, res1){
        if(err)
            console.error(err);
        res.json(res1);
    });
});

var diretoryTreeToObj = function(dir, done) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err)
            return done(err);

        var pending = list.length;

        if (!pending)
            return done(null, {name: path.basename(dir), type: 'folder', children: results});

        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    diretoryTreeToObj(file, function(err, res) {
                        results.push({
                            name: path.basename(file),
                            type: 'folder',
                            children: res
                        });
                        if (!--pending)
                            done(null, results);
                    });
                }
                else {
                    results.push({
                        type: 'file',
                        name: path.basename(file)
                    });
                    if (!--pending)
                        done(null, results);
                }
            });
        });
    });
};

app.get('/', function(req, res) {
     res.sendFile(path.join(__dirname + '/index.html'));
//    console.log(path.join(__dirname + '/index.html'));
 //   res.send(path.join(__dirname));

});
var port = process.env.PORT || 8080;

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
