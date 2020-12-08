const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require('fs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("index");
});

app.get('/create', (req,res) => {
    res.render("create");
});

app.get('/read', (req,res) => {
    let files = []
    fs.readdirSync("./DataStorage").forEach((data) => {
        files.push(data);
    });
    res.render("read", {data : files, available: files.length});
});

app.get('/delete', (req,res) => {
    let files = []
    fs.readdirSync("./DataStorage/").forEach((data) => {
        files.push(data);
    });
    res.render("delete", {data : files, available: files.length});
}); 

app.post("/create", (req, res) => {
    console.log(req.body);
    let fileName = "./DataStorage/" + req.body.key  + ".txt";
    fs.open(fileName, 'w+', (err, data) => {
        if(err) return console.error(err);
        console.log("Opened Successfully.");
        fs.appendFile(fileName , req.body.value + "\n", (err) => {
            if(err) console.log(err);
        });
        // fs.close();
        res.redirect("/");
    });
});

app.post("/delete", (req, res) => {
    console.log(req.body);
    let deleteFile = "./DataStorage/" + req.body.toBeDeleted;
    fs.unlink(deleteFile, (err) => {
        if(err) return console.log(err);
        console.log("DELETED SUCCESSFULLY.")
    })
    res.redirect("/delete");
});

app.post("/read", (req, res) => {
     let readFile = "./DataStorage/" + req.body.toBeRead;
     var data = fs.readFileSync(readFile , 'utf8')
         console.log(data); 
    var textedJson = JSON.stringify(data); 

    res.render("view", {data: data});
});

app.listen(3000, () => {
    console.log("Server running at port 3000");
});