import {z} from "zod"
import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";
import {usernameValidation} from "@/src/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request){

    if(request.method!=='GET'){
        return Response.json({
            success:false,
            message:"method not allowed"
        },{status:405})
    }

    await dbConnect()

    try {
        const {searchParams} =new URL(request.url)
        const queryParam ={
            username: searchParams.get('username')
        }
        //validate with zod 
       const result= UsernameQuerySchema.safeParse(queryParam)

       console.log(result) //Remove
       if(!result.success){
        const usernameErrors= result.error.format().username?._errors || []
        return Response.json({
            succcess:false,
            message:usernameErrors?.length>0 ? usernameErrors.join(','):'Invalid query parameters',
        },{status:400})
       }

       const {username}= result.data
       const verifiedUser=await UserModel.findOne({username,isVerified:true})
       if(verifiedUser){
        return Response.json({
            success:false,
            message: "Username is already taken"
        },{status:401})
       }
      
        return Response.json({
            success:true,
            message: "Username is unique"
        },{status:400})
      

    } catch (error:any) {
        console.log("Error Checking username", error)
        return Response.json({
            success:false,
            message: "Error Checking username"
        },{status:500})
        

    }
}