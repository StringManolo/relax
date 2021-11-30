"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendMail = (destinationEmail, emailSubject, data) => {
    const send = require('gmail-send')({
        user: "example@gmail.com",
        pass: "12345678",
        to: destinationEmail,
        subject: emailSubject
    });
    send({ text: data }, (error, result, fullResult) => {
        return error ? false : true;
    });
};
exports.default = sendMail;
