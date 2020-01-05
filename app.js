//jshint esversion:6

const express  = require("express");
const bodyParser  = require("body-parser");
const request  = require("request");


const app = express();

//serving static files ie from local
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

//body api member reference (object)
  var data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
//
  var jsonData = JSON.stringify(data);

  var options = {
    //Authorization post request
    url:"https://usX.api.mailchimp.com/3.0/lists/LIST-KEY",
    method:"POST",
    headers:{
      "Authorization":"NameToAuth API-KEY"
    },
    //body data*
    body:jsonData
  };
  request(options, function(error, response, body){
    //message confirmation
    if(error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  // console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});

