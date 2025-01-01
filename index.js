
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var compression = require('compression')

const app = express();


app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname));
});

app.post('/send-email', (req, res) => {
    const { name, email, subject, message, phone } = req.body;


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

        // text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
        html: `
        <div class="mail-temp">
    <style>

        .mail-temp {
            max-width: 450px;
            width: 100%;
            margin: auto;
            font-family: sans-serif;
        }
       
        table{
            width: 100%;
            border-collapse: collapse;
        }
        table > tr{
            width: 100%;
        }
        .mail-temp .logo{
         
         background: #e1999f;
         padding: 10px;
        }
        .mail-temp .logo img{
            width: 100px;
            margin: auto;
        }

        .mail-temp .logo p{
            text-align: center;
        }
        .mail-temp .hero{
            max-width: 450px;
            object-fit: cover;
            margin: auto;
        }

        .mail-temp  h2{
            text-align: center;
            font-size: 25px;
            font-weight: 700;
            color: #e1999f;
        }

            .mail-temp .contact{
                padding: 0 40px;
            }
            .mail-temp .contact p{
                margin: 10px 0px;
            }
            .mail-temp .message p{
                    text-align: center;
                    padding: 0 10px;
            }
            .mail-temp .footer{
                background-color: #e1999f;
                text-align: center;
                padding: 30px 0px;
                color: white;

            }
    </style>
        <table >
            <tr>
                <td class="logo">
                    <p>
                        <img src="https://my-thread.com/mail/logo.png"   alt="">
                    </p>
                    
                </td>
            </tr>
            <tr>
                <td>
                    <img class="hero" src="https://my-thread.com/mail/banner.jpg" alt="">
                </td>
            </tr>
            <tr>
                <td class="contact">
                            <h2>Contact Details</h2>
                            <p>Name : ${name}</p>
                            <p>Email : ${email}</p>
                            <p>Phone : ${phone}</p>

                </td>
            </tr>

            <tr>
                <td class="message">
                    <h2>Message</h2>
                <p>
                    ${message}
                </p>
                </td>
            </tr>

            <tr class="footer">
                <td>
                    <p>
                        &copy; 2025 Thread Blinds & Curtains. All Rights Reserved.
                    </p>
                </td>
            </tr>
        </table>
    </div>
        `
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