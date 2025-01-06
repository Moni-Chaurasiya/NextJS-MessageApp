// import {resend} from "../lib/resend";
// import VerificationEmail from "../../emails/VarificationEmail";
// import { ApiResponse } from "../types/ApiResponse";
// export async function sendVerificationEmail(
//     email:string,
//     username:string,
//     verifyCode:string
// ):Promise<ApiResponse>{
//     try{
//             await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: "Message Verification code",
//             react: VerificationEmail({username,otp:verifyCode}),
//           });
//         return{success:true,message:"Verification send successfully"}
//     }catch(emailError){
//         console.log("Error sending verification email", emailError)
//         return{success:false,message:'Failed to send verification email'}
//     }
// }

/*
import ReactDOMServer from 'react-dom/server';
import VerificationEmail from "../../emails/VarificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import {transportor}  from "../lib/resend"
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Render the VerificationEmail component to HTML string
    const emailBody = ReactDOMServer.renderToStaticMarkup(
      VerificationEmail({ username, otp: verifyCode })
    );

    // Send the email
    await transportor.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Message Verification code",
      html: emailBody,  // Pass the rendered HTML string
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
*/
import { ApiResponse } from "../types/ApiResponse";
import { transportor } from "../lib/resend"; // Ensure this path is correct

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailBody = `
      <div>
        <h1>Hi ${username},</h1>
        <p>Your verification code is: <strong>${verifyCode}</strong></p>
      </div>
    `;

    // Send email
    await transportor.sendMail({
      from: process.env.MAIL_FROM, 
      to: email,
      subject: "Message Verification Code",
      html: emailBody,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
