const express = require('express');
const session = require('express-session');
const convert = require('xml-js');
const jwt = require('jsonwebtoken');
const pageRouter = require('./routes/pagerouting');
const bcrypt=require("bcrypt")
const app=express();

app.set('port',(process.env.PORT || 5000))
app.use(express.json()); 
app.use(express.urlencoded( { extended : false}));
var cors = require('cors')

app.use(cors())
// app.use(session({
//     secret:'skoolkube',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 60 * 1000 * 30
//     }
// }));


app.listen(app.get('port'),()=>{
console.log("app listining to port::",port);
});


app.use('/', pageRouter);
// app.post('/login',(req,res)=>{
//     console.log("uid ",req.body.uid)
// })
module.exports=app;
