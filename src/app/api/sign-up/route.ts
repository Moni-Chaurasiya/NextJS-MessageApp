import dbConnect from "@/src/lib/dbConnect"
import UserModel from "@/src/model/User"
import bcrypt from "bcryptjs"

import {sendVerificationEmail} from "@/src/helpers/sendVerificationEmail"

export async function POST(request:Request){
    await dbConnect()

    try{
        const {username,email,password} = await request.json()
        const verifiedByUsername= await UserModel.findOne({
            username,
            isVerified:true
        })
        if(verifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400})
        }
        const verifiedByEmail= await UserModel.findOne({email})
        const verifyCode= Math.floor(100000+Math.random()*900000).toString()

        if(verifiedByEmail){
            if(verifiedByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist by this email"
                },{status:400})
            }else{
                const hashedPassword =await bcrypt.hash(password,10);
                verifiedByEmail.password=hashedPassword;
                verifiedByEmail.verifyCode=verifyCode;
                verifiedByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await verifiedByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser =   new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified: false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save()
        }
        const emailResponse= await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"User Register Successfully. Please verify your email"
        },{status:200})

    } catch(error){
        console.log("Error registering user",error)
        return Response.json(
    {
        success:false,
        message:"Error registering user"
    },
    {
        status:500
    }
)
    }
}

