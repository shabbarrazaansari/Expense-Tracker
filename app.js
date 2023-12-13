const express = require('express');
const Sequelize = require('sequelize')
const sequelize = require('./util/database')
const bodyParser = require('body-parser')
const cors = require("cors")
const app = express();
const port= 1000;

const adminRoutes = require('./routes/adminroutes')

const user = require('./models/user')
const expense = require('./models/expense')
app.use(bodyParser.json({extended :true}))
app.use(cors());

app.use(adminRoutes);


sequelize.
//  sync({force:true})
  sync()
.then(result=>{
    app.listen(port,()=>{
        console.log('port is running',port)
    })
    
})


