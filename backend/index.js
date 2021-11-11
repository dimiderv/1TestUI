const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');

/*****Had to modify a file for mongoose to work******

/home/dejvi/Documents/Tutorials/Nodejs/CodrKai/Node_Mongo_React/backend/node_modules/whatwg-url/dist/encoding.js:4
added var util=require('util')
const utf8Encoder = new util.TextEncoder(); //changes this , added util
const utf8Decoder = new util.TextDecoder("utf-8", { ignoreBOM: true });

The error that was showing was

/home/dejvi/Documents/Tutorials/Nodejs/CodrKai/Node_Mongo_React/backend/node_modules/whatwg-url/dist/encoding.js:4
const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });
ReferenceError: TextDecoder is not defined

***********/

/*
const mongoose=require('mongoose');*/
require("dotenv/config");

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', routesHandler);
app.use(express.json());
// const PORT = 4000; // backend routing port this was with the Node-React Tutorial


// DB Connection
// mongoose.connect(process.env.DB_URI, {useNewUrlParser:true,useUnifiedTopology:true})
// .then( ()=>{
//     console.log("DB CONNECTED")
// })
// .catch((err)=>{
//     console.log(err)
// })
/* //if i work on prouction code
if(process.env.NODE_ENV==='production'){
    //Serve any static files
    app.use(express.static(path.join(__dirname,'client/build')));

    //Handle React routing, return all requests to React app
    app.get('*',function(req,res){
        res.sendFile(path.join(__dirname,'client/build',routesHandler))
    })
}
*/
const PORT =process.env.PORT || 4000; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
