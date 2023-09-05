// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//import Mail from "@ioc:Adonis/Addons/Mail"
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

const AWS = require('aws-sdk');
const ses = new AWS.SES();

export default class MailersController {
 public async SendMail() {
  // Create an SES client
        const credentials = fromIni({
            accessKeyId: 'AKIAXILXCVAK7AVUOSUX',     // Replace with your AWS access key
            secretAccessKey: 'BBlme+pdRY38Z+sPThdZsA33DL4DbzUjp4EBEEw4qhTc', // Replace with your AWS secret key
        });

        const client = new SESClient({  
        region: 'ap-southeast-2',
        credentials
        });

  // Create an SES email parameters object
  const params = {
    Destination: {
      ToAddresses: ['shakir@ubitechsolutions.com'], // An array of recipient email addresses
    },
    Message: {
      Body: {
        Text: {
          Data: 'This is the email body text.',
        },
      },
      Subject: {
        Data: 'Email Subject',
      },
    },
    Source: 'noreply@ubiattendance.xyz', // The sender's email address (verified in SES)
  };

  try {
    // Send the email using the SendEmailCommand
    const data = await client.send(new SendEmailCommand(params));
    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}


//    public async SendMail(){

//     ses.sendEmail(params, (err, data) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log(data);
//         }
//       });
//     // try {
//     //     console.log("done");
        
//     //     await Mail.send((message) => {
//     //       message
//     //         .from('noreply@ubiattendance.xyz')
//     //         .to('shakir@ubitechsolutions.com')
//     //         .subject('Subject of the email')
//     //         .htmlView('emails/welcome', { name: 'John Doe' }) // Use your email template
//     //     })
//     //   } catch (error) {
//     //     // Handle email sending error
//     //     console.error('Error sending email:', error)
//     //   }
//    }
}
