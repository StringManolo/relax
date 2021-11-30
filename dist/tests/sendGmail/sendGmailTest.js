"use strict";
const send = require('gmail-send')({
    user: 'example@gmail.com',
    pass: '12345678',
    to: 'example@gmail.com',
    subject: 'test subject',
});
send({
    text: 'gmail-send example 1',
}, (error, result, fullResult) => {
    if (error)
        console.error(error);
    console.log(result);
});
