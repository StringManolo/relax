const sendMail = (destinationEmail: string, emailSubject: string, data: string) => {
  const send = require('gmail-send')({
    user: "example@gmail.com",
    pass: "12345678",
    to: destinationEmail,
    subject: emailSubject
  });

  send({ text: data }, (error: Error, result: any, fullResult: any) => {
    return error ? false : true;
  });
}

export default sendMail;
