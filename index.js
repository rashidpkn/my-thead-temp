
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname));
});

app.post('/send-email', (req, res) => {
    const { name, email, subject, message, phone } = req.body;
    console.log(req.body)


    const transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.com',
        auth: {
            user: 'info@my-thread.com',
            pass: 'e8aZkrdLZQrk'
        }
    });

    const mailOptions = {
        from: 'info@my-thread.com',
        to: 'info@my-thread.com',
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Error sending email.');
        } else {
            console.log('Email sent: ' + info.response);
            res.sendFile(__dirname + '/thankyou/index.html')
        }
    });






});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});