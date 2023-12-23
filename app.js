const express = require('express');
// const Sequelize = require('sequelize')
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database')


const bodyParser = require('body-parser')

const cors = require("cors")
const app = express();
// const port = process.env.PORT || 1000;
 const port= 1000;
// dotenv.config();

const adminRoutes = require('./routes/adminroutes')
const purchase = require("./routes/purchase")
const premiumfeatures = require('./routes/premiumFeatures');
const resetPasswordRoutes = require('./routes/resetpassword')


const user = require('./models/user')
const expense = require('./models/expense')
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');

app.use(bodyParser.json({extended :true}))
app.use(cors());

user.hasMany(expense)
expense.belongsTo(user)

user.hasMany(Order);
Order.belongsTo(user); 
user.hasMany(Forgotpassword);
Forgotpassword.belongsTo(user);

app.use(adminRoutes);
app.use(purchase);
app.use(premiumfeatures);
app.use(resetPasswordRoutes);


sequelize.
//  sync({force:true})
   sync()
.then(result=>{
    app.listen(port,()=>{
        console.log('port is running',port)
    })
    
})


