const express = require("express");
const https = require("https");

const { response } = require("express");

const app = express();

//for purpose of parse
app.use(express.urlencoded({extended:true}));
//for purpose of css and images
app.use(express.static("public"));



//set up port
const port = 3000;
app.listen(process.env.PORT || port, () => {
    console.log(`App runs on localhost:${port}`)
})

//user reach route via GET
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html")
})

//user reach route via POST
app.post("/", (req, res) => {

    //set up variables for input fields on html form 
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    //package info received from html form as a JSON in string form
    const data = {
    members: [
        {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
        }
    ]
    };
    const jsonData = JSON.stringify(data);
    
    //send authenticated data to mailchimp using Node's https package 
    const url = "https://us5.api.mailchimp.com/3.0/lists/e1654f8371";
    const options = {
    method: "POST",
    auth: "weilin:cd985d5f99c479276e23692e84b7c692-us5"
    }
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
        console.log("Successful");
        })
    });
    
    request.write(jsonData);
    request.end();
    


    /*latest solution by Mailchimp as of Sep 2021*/

    // const listId = "e1654f8371";
    // const subscribingUser = {
    //   FName: req.body.firstName,
    //   LName: req.body.lastName,
    //   email: req.body.email
    // };

    // const run = async () => {
    //     const response = await client.lists.batchListMembers(listId, {
    //       members: [
    //           {
    //             email_address: subscribingUser.email,
    //             status: "subscribed",
    //             merge_fields: {
    //                 FNAME: subscribingUser.FName,
    //                 LNAME: subscribingUser.LName
    //                 }
    //             }
    //         ],
    //     });
    //     console.log("Successful");
    // };
      
    // run();

    // if (response.statusCode === 200) {
    //     res.sendFile(__dirname + "/success.html");
    // } else {
    //     res.sendFile(__dirname + "/failure.html");
    // }

});

//redirect user to homepage if failure
app.post("/retry", (req,res) => {
    res.redirect("/");
})


//API key: 
//cd985d5f99c479276e23692e84b7c692-us5
//List ID: 
//e1654f8371