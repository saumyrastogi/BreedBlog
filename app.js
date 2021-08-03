//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const homeStartingContent = "Why are there so many dog lovers out there ? Dogs share our lives in a way that most other animals can't, and they're so commonplace that it's easy to take their faithful companionship for granted. The purpose of this article is to remind us of why we love dogs so much, to spare a few minutes and to spare a few words in praise of man's best friend, the dog.Dogs are friendly and they love human companionship. Whose ego would not be gratified at the sight of a happy dog who can't wait to greet you at the end of a hard day ? Your dog waits for you by the door, face smiling, mouth open and tail wagging, ready to dote on you, his best friend in the world.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public/"));

mongoose.connect('mongodb+srv://saumya:saumy@123@cluster0.u7gby.mongodb.net/blogdb',{useNewUrlParser: true ,useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  postname : String,
  aboutpost : String,
});

const Post = mongoose.model('Post',postSchema);

app.get('/',(req,res)=>{
  Post.find({},(err,items)=>{
    if(err)
    console.log(err);
    else {
      res.render('home',{startcontent:homeStartingContent,
        items:items});
    }
});
});
app.route('/posts')
.get((req,res)=>{
  Post.find({},(err,items)=>{
    if(err)
    console.log(err);
    else {
      res.render('home',{startcontent:homeStartingContent,
        items:items});
    }
  });
})
.post((req,res)=>{
  const newitem = new Post({
    postname: req.body.title,
    aboutpost: req.body.body,
  });

  Post.insertMany([newitem],(err)=>{
    if(err)
    console.log(err);

    else {
    res.redirect('/posts');
    }
  });
});


app.route('/posts/:id')
.get((req,res)=>{
  const match = req.params.id;
  Post.findOne({_id:match},(err,result)=>{
    if(err)
    console.log(err);
    else {
      res.render('post',{item:result});
    }
  });
});

app.get('/delete/:id',(req,res)=>{
  const match = req.params.id;
  Post.deleteOne({_id:match},(err,result)=>{
    if(err)
    console.log(err);
    else {
      res.redirect('/posts');
    }
  });
});

app.get('/update/:id',(req,res)=>{
  const item = req.params.id;
  Post.findOne({_id:item},(err,found)=>{
    if(err)
    console.log(err);
    else{
      res.render('update',{item:found});
      Post.deleteOne({_id:item},(err,result)=>{
        if(err)
        console.log(err);
      });
    }
  });
});


app.get('/about',(req,res)=>{
  res.render('about',{aboutdata:aboutContent});
});

app.get('/contact',(req,res)=>{
  res.render('contact',{contactdata:contactContent});
});

app.get('/compose',(req,res)=>{
  res.render('compose');
});

app.get('/confdel/:id',(req,res)=>{
  res.render('confdelete',{id:req.params.id});
});

app.listen(process.env.PORT||3000 , function() {
  console.log("Server started on port 3000");
});
