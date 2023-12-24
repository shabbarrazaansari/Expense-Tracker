const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const Sequelize = require('sequelize')
const uuid = require('uuid');
const user = require('../models/user');
const ForgetPassReq = require('../models/forgotpassword');
const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

exports.forgotpassword = async (req, res) => {
    const userEmail = req.body;
    console.log('userEmail',userEmail)

    try {
        // Find the user based on the provided email
        const User = await user.findOne({ where: { email: userEmail.email } });

        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a new UUID for the reset request
        const requestId = uuid.v4();

        // Create a ForgetPassReq record for the reset request
        const resetRequest = await ForgetPassReq.create({
            id: requestId,
            isActive: true,
            userId: User.id
        });

        const resetLink = `http://localhost:1000/resetpassword/${requestId}`;

        // Send email using Sendinblue
        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "Password Reset";
        sendSmtpEmail.htmlContent = `<p>Click on the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;
        sendSmtpEmail.sender = { name: "sbr", email: "shabbaransari98@gmail.com" };
        sendSmtpEmail.to = [{ email: userEmail.email }];

        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('Email sent successfully. Response:', data);
            res.status(200).json({ message: "Reset password email sent successfully." });
        }).catch(function (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: "Error sending reset password email." });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.resetpassword = async (req, res) => {
    const { id } = req.params;


    try {
        // Find the ForgetPassReq record based on the provided ID
        const request = await ForgetPassReq.findOne({ where: { id } });

        if (!request) {
            return res.status(404).json({ message: "Reset request not found" });
        }

        // Check if the request is still active (optional, based on your application logic)
        if (!request.isActive) {
            return res.status(400).json({ message: "Reset request is no longer active" });
        }

        // Find the associated user based on the userId in ForgetPassReq
        const User = await user.findOne({ where: { id: request.userId } });

        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).send(`
        <form action='/updatepassword/${id}' method="POST"  >
                  
        <label for="password">Enter Password :</label>
        <input type="password" name="newpassword" id="password"  required>
        
        <br>
        <input type="submit" value="Reset Password"  >
        <br>
    </form>      `)

        // Render a page where the user can enter a new password
        // You can send the user to a page with a form to enter a new password
        // This is where the user will submit the new password

        // Example of rendering a password reset form
        // res.render('resetpassword', { requestId: request.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.postUpdatePassword = async (req, res) => {
    const { newpassword } = req.body;
    const { resetpasswordid } = req.params;

    try {
        // Find the ForgetPassReq record based on the provided ID
        const request = await ForgetPassReq.findOne({ where: { id: resetpasswordid } });
        // console.log('request>>>',request)

        if (!request) {
            return res.status(404).json({ message: "Reset request not found" });
        }

        // Check if the request is still active (optional, based on your application logic)
        if (!request.isActive) {
            return res.status(400).json({ message: "Reset request is no longer active" });
        }

        // Find the associated user based on the userId in ForgetPassReq
        const User = await user.findOne({ where: { id: request.userId } });
        console.log(User)

        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's password with the new one
        bcrypt.hash(newpassword, 10, async (err, hash) => {
            await user.update({ password: hash }, { where: { id: User.id } });
            // Optionally, mark the reset request as used or inactive
            await request.update({ isActive: false });

            res.status(200).json({ success: true, message: "Password changed successfully" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
