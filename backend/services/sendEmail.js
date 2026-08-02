
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function sendEmail(to, subject, text) {
  await resend.emails.send({
    from: "CondoManager AI <no-reply@condomanager.ai>",
    to,
    subject,
    text
  });
};
