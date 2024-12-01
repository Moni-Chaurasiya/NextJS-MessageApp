import {resend} from "../lib/resend";
import VerificationEmail from "../../emails/VarificationEmail";
import { ApiResponse } from "../types/ApiResponse";
export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try{
            await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "Message Verification code",
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return{success:true,message:"Verification send successfully"}
    }catch(emailError){
        console.log("Error sending verification email", emailError)
        return{success:false,message:'Failed to send verification email'}
    }
}