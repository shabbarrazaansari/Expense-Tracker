const Razorpay = require('razorpay');
const Order = require('../models/orders');
const { where } = require('sequelize');
// const { json } = require('body-parser');
// console.log("key id",process.env.RAZORPAY_KEY_ID);
const userController = require('./signup')

exports.purchasePremium = async (req, res) => {

   
    try {
        var rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret :process.env.RAZORPAY_KEY_SECRET  
    });
        

        const amount = 2500;
        await rzp.orders.create({ amount, currency: "INR" },async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({ orderid: order.id, status: 'PENDING' })
                
            return res.status(201).json({ order, key_id: rzp.key_id });
               
        });

    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'something went wrong' });
    }
};


exports .updateTransaction = async (req,res)=>{
    try {
        const userId = req.user.id;
        const {payment_id,order_id} = req.body;
        const order = await Order.findOne({where:{orderid:order_id}})
        const promise1 = order.update({paymentid:payment_id,status:"SUCCESFUL"})
        const promise2 = req.user.update({ispremiumuser:true})

        Promise.all([promise1,promise2]).then(()=>{

            return res.status(202).json({success:true,message:"transction Successful",token:generateWebToken(userId,true)});
        })
        .catch((err)=>{
            throw new Error(err)
        })
                   
               
    } catch (error) {
        throw new Error(err);
    }
}
function generateWebToken(id,ispremiumuser) {
    return jwt.sign({userId:id,ispremiumuser},'8090501210')
}
// module.exports = purchasePremium;
    


