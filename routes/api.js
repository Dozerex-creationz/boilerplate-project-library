/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app,mongo) {
  const bookSchema=new mongo.Schema({
    title:String,
    commentcount:{type:Number,default:0},
    comments:[
      String
    ],
  },{versionKey:false});
  const Book=new mongo.model("Book",bookSchema)
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      Book.find({},{comments:0},(err,data)=>{
        res.send(data);
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title){
        res.send("missing required field title");
      }
      else{
      var newr={title:title,comments:[],commentcount:0}
      Book.create(newr,(err,data)=>{
        if(err) console.log(err)
        data.save((err,dat)=>{
          res.send({_id:dat._id,title:dat.title});
        })
      })}
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({},(err,data)=>{
        res.send("complete delete successful");
      });
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      if(!bookid){
        res.send("missing required field title");
      }
      else{
      Book.findOne({_id:bookid},{commentcount:0},(err,data)=>{
        if(!data || err){
          res.send("no book exists")
        }
        else res.send(data);
      })}
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log(req.body);
      console.log(req.params.id);
      console.log("hi"+comment);
      if(!bookid){
        res.send("missing required field title")
      }
      else if(!comment){
        res.send("missing required field comment")
      }
      else{
      Book.findByIdAndUpdate(bookid,{new:true},(err,data)=>{
        if(err) console.log(err)
        console.log(data);
        if(!data || err){
          console.log(err)
          res.send("no book exists")
        }
        else{
          console.log("else block")
        data.comments.push(comment);
        data.commentcount+=1;
        data.save((err,data)=>{
          res.send(data);
        })}
      })}
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findOneAndDelete({_id:bookid},(err,data)=>{
        if(!data){
          res.send("no book exists");
        }
        else{
          res.send("delete successful");
        }
      })
    });
  
};
