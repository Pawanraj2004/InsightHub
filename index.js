const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
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

// Posts
let posts = [
    {
        id: uuidv4(),
        username: "Shreya Sahu",
        img: "/port60.jpg",
        topic: "Programming",
        content: "DSA is an important aspect for making out in interviews.",
        comments: [
            { _id: uuidv4(), content: "Great post!" },
            { _id: uuidv4(), content: "I agree!" }
        ]
    },
    {
        id: uuidv4(),
        username: "Pawanraj Kushwah",
        img: "/health.webp",
        topic: "Health",
        content: "Eating healthy is necessary for a healthy body.",
        comments: [
            { _id: uuidv4(), content: "Good advice!" }
        ]
    },
    {
        id: uuidv4(),
        username: "Khushi",
        img: "/soft.png",
        topic: "Soft Skills",
        content: "Communication is important for building networks.",
        comments: [
            { _id: uuidv4(), content: "I agree!" }
        ]
    }
];


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
    const post = posts.find(post => post.id === postId);

    if (post) {
        // Generate a unique ID for the comment
        const commentId = uuidv4();
        
        // Add the comment to the specific post
        if (!post.comments) {
            // If the comments array doesn't exist, create it
            post.comments = [];
        }
        post.comments.push({ _id: commentId, content: comment });
        console.log(posts);
        res.redirect("/blogs/" + postId); // Redirect to the detailed view of the post
    } else {
        res.status(404).send("Post not found");
    }
});


//delete route

app.delete("/blogs/comments/:postId/:commentId", (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Find the post by its ID
    const post = posts.find(post => post.id === postId);

    if (post) {
        // Find the comment index by its ID
        const commentIndex = post.comments.findIndex(comment => comment._id === commentId);

        if (commentIndex !== -1) {
            // Remove the comment from the comments array
            post.comments.splice(commentIndex, 1);
            console.log(posts); // Optionally log the updated posts array
            res.redirect("/blogs/" + postId); // Redirect to the detailed view of the post
        } else {
            res.status(404).send("Comment not found");
        }
    } else {
        res.status(404).send("Post not found");
    }
});


app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})