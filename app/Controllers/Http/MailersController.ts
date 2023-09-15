// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//import Mail from "@ioc:Adonis/Addons/Mail"
import Mail from '@ioc:Adonis/Addons/Mail'
import Helper from 'App/Helper/Helper'
// const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");


export default class MailersController {
   public async sendEmail() {
        Helper.sendEmail();
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
