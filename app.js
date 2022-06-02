require('dotenv').config();
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const pageRouter = require('./routes/pagerouting');
const bcrypt=require("bcrypt");
var _ = require('lodash');
const app=express();

app.set('port',(process.env.PORT))
app.set('host',(process.env.HOST))
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




app.use('/', pageRouter);
    var server = app.listen(app.get('port'),app.get('host'),()=>{
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
    });

module.exports=app;
