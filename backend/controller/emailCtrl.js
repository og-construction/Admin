const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();
const sendEmail = asyncHandler(async (data) => {
    try {
        let templatePath;

        // Choose the correct template based on the email type
        if (data.type === 'verifyEmail') {
            templatePath = path.join(__dirname, './emailTemplate.html');
        } 
        else if (data.type === 'otpverifyDelivery') {
            templatePath = path.join(__dirname, './otpDeliveryTemplate.html');
        } 
        
        else if (data.type === 'forgotPassword') {
            templatePath = path.join(__dirname, './forgotPasswordTemplate.html');
        } else if (data.type === 'orderInvoice') {
            templatePath = path.join(__dirname, './orderInvoiceTemplate.ejs');
            
        } else if (data.type === 'interestedUser' || data.type === 'interestedUsers') {
            templatePath = path.join(__dirname, './interestedUsers.html');
        }
        else if(data.type === 'sellerDetails'){
            templatePath = path.join(__dirname,'./sellerDetails.html')
          } else {
            throw new Error("Invalid email type");
        }

        // Render the template with the provided data
        const html = await ejs.renderFile(templatePath, {
            name: data.name,
            otp: data.otp || null, // For email verification
            resetURL: data.resetURL || null, // For password reset
            ...data.templateData, // Include other dynamic data for the email
        });

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.OGCS,
                pass: process.env.OGCS_PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: `"BuildPro OGCS" <${process.env.OGCS}>`,
            to: data.to,
            subject: data.subject,
            html,
        });

        console.log("Email sent successfully to:", data.to);
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Email sending failed");
    }
});



module.exports = sendEmail;
