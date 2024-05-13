const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
// EJS for templating 

app.set("view engine","ejs");

//static files

app.use(express.static("public"));
app.use(express.static("images"));

app.use(express.urlencoded({extended:true}));


const port = 8080;
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images") // Specify the directory where you want to store the images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Rename the file if needed
    }
})
const upload = multer({ storage: storage })

//Posts

let posts = [
    {
        id : uuidv4(),
        username : "Shreya Sahu",
        img : "/port60.jpg",
        topic : "Programming",
        content : "DSA is an important aspect for making out in interviews."
    },
    {
        id : uuidv4(),
        username : "Pawanraj Kushwah",
        img : "/health.webp",
        topic : "Health",
        content : "Eating healthy is necessary for a healthy body."
    },
    {
        id : uuidv4(),
        username : "Khushi",
        img : "/soft.png",
        topic : "Soft Skills",
        content : "Communication is important for building networks."
    }
]

 // creating a server
 app.listen(port,()=>{
    console.log(`request at port ${port}`);
   });

//Index Route
app.get("/blogs",(req,res)=>{

    res.render("index.ejs" , {posts});
    // res.send("request successful");
    
})
//Creating new post

app.get("/blogs/new",(req,res)=>{
    res.render("new.ejs");
})

app.post("/blogs", upload.single('image'), (req, res) => {
    let { username, topic, content } = req.body;
    let id = uuidv4();
    let img = req.file ? `/${req.file.filename}` : ""; // Retrieve the filename of the uploaded image if it exists
    posts.push({ id,username, topic, content, img });
    console.log(posts);
    res.redirect("/blogs");
})

// view a post in detail

app.get("/blogs/:id",(req,res)=>{
    let {id} = req.params;
    let post=posts.find((p)=>id === p.id);
    console.log(post);
    res.render("id.ejs",{post});
});

//add a comment 
app.get("/blogs/comments/:id", (req, res) => {
    // Render the form to add a comment
    res.render("comments.ejs", { postId: req.params.id });
});

app.post("/blogs/comments/:id", (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;

    // Find the post by its ID
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex !== -1) {
        // Add the comment to the specific post
        if (!posts[postIndex].comments) {
            // If the comments array doesn't exist, create it
            posts[postIndex].comments = [];
        }
        posts[postIndex].comments.push(comment);
        console.log(posts);
        res.redirect("/blogs/" + postId); // Redirect to the detailed view of the post
    } else {
        res.status(404).send("Post not found");
    }
});

