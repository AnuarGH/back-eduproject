const nodemailer  = require('nodemailer');
const config = require('../../config');
const sender = {
    user: 'noreply.kenzhemir@gmail.com',
    pass: 'cA2l9aY3HFp2'
};


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: sender
});

let sendMail = async ({from, to, subject, text}) => {
    return await transporter.sendMail({from, to, subject, text}, function(error){
        if (error) {
            return error;
        }
    });
};

let sendVerificationEmail = async (to, token) => {
    let mailOptions = {
        from: sender.user,
        to,
        subject: "Verify your email at our service!",
        text: `
                This is an automatic email to verify your email\n
                Your verification link:
                ${config.get("website:address")}/verify/${token}
              `
    };
    return await sendMail(mailOptions);
};

module.exports = {
    sendVerificationEmail,
};