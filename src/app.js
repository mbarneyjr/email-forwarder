const AWS = require('aws-sdk');

const forwardFrom = process.env.FROM_ADDRESS;
const forwardTo = process.env.TO_ADDRESS;

exports.handler = async function(event, context) {
  console.log(`Event: ${JSON.stringify(event)}`);
  const messageInfo = JSON.parse(event.Records[0].Sns.Message);

  if (messageInfo.receipt.spamVerdict.status === 'FAIL' || messageInfo.receipt.virusVerdict.status === 'FAIL') {
    console.log('Message is spam or contains virus, ignoring.');
    return 'Success!';
  }

  const email = parseEmail(messageInfo);
  console.log(`Email: ${email}`);

  const ses = new AWS.SES();
  const response = await ses.sendRawEmail({ RawMessage: { Data: email } }).promise();
  console.log(`Sent with MessageId: ${response.MessageId}`);
  return 'Success!';
};

function parseEmail(messageInfo) {
  const email = messageInfo.content;
  let headers = `From: ${forwardFrom}\r\n`;

  headers += `Reply-To: ${messageInfo.mail.commonHeaders.from[0]}\r\n`;
  headers += `X-Original-To: ${messageInfo.mail.commonHeaders.to[0]}\r\n`;
  headers += `To: ${forwardTo}\r\n`;
  headers += `Subject: Fwd: ${messageInfo.mail.commonHeaders.subject}\r\n`;

  if (email) {
    const contentTypeBoundary = email.match(/Content-Type:.+\s*boundary.*/);
    const contentType = email.match(/^Content-Type:(.*)/m);
    const contentTransferEncoding = email.match(/^Content-Transfer-Encoding:(.*)/m);
    const mimeVersion = email.match(/^MIME-Version:(.*)/m);

    if (contentTypeBoundary)
      headers += `${contentTypeBoundary[0]}\r\n`;
    else if (contentType)
      headers += `${contentType[0]}\r\n`;

    if (contentTransferEncoding)
      headers += `${contentTransferEncoding[0]}\r\n`;

    if (mimeVersion)
      headers += `${mimeVersion[0]}\r\n`;

    const body = email.split('\r\n\r\n').slice(1).join('\r\n\r\n');
    return `${headers}\r\n${body}`;
  }
  else {
    return `${headers}\r\nEmpty email`;
  }
}
