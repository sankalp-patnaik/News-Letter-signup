const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const request=require("request");
const https = require("https");
require("dotenv").config();
const port = process.env.PORT ? process.env.PORT : 3000;
const apiKey = process.env.MAILCHIMP_API_KEY;
const listId = process.env.LIST_ID;


//Here We using a Method from express:- app.use(express.static("name of the folder here Name of the folder is Public"))
//In Public Folder stored local files like css folder, Images folder 
//inside css folder styles.css file is there & inside images folder logo image is there,
//which are stored in locally so thats why we using express.static method to send those files to Local host 3000
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res){
    const firstName=req.body.fname;
    const lastname=req.body.lname;
    const Email=req.body.email;

    const data={
        members:
        [                   //Members are array of objects
            {
                email_address:Email,
                status:"subscribed",
                merge_field:{ 
                   FNAME:firstName, 
                   LNAME:lastname
                },
            },
        ],
    };
    //converting the data into String that is in the the format JSON
    const Jsondata=JSON.stringify(data);
    const url="https://us10.api.mailchimp.com/3.0/lists/"+listId;
    const options={
        method:"POST",
        auth:"sankalp1:"+apiKey,
    }
   const request= https.request(url,options,function(response){
       if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else{
           res.sendFile(__dirname+"/failure.html")
        }
       response.on("data",function(data){
           console.log(JSON.parse(data));
           
       });

    });
    request.write(Jsondata);
    request.end();
});
app.post("/failure",function(request,response){
   response.redirect("/");
});
app.post("/success",function(req,res){
    res.redirect("/");
})
// app.post("/success",function(req,res){
//     res.redirect("/");
// })
app.listen(port,function()
{
    console.log("Server Is Running on Port 3000");
})
//ApI Key:- ab5136a35660d3c38c9c49f3e3f59b3f-us10

//List Id or Audience Id:- ff1fb09624

//${dc}