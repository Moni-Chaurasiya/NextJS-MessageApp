
import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();
    try {

        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username);
        console.log('Decoded Username:', decodedUsername); // Log the decoded username
        
        const user = await UserModel.findOne({ username: decodedUsername });
        console.log('Fetched User:', user); // Log the user fetched from the database

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status:500
                }
            )
        }

        const isCodeValid= user.verifyCode===code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date();
        if(isCodeValid && isCodeNotExpired){
            user.isVerified =true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "Account Verified Successfully"
                },
                {
                    status:200
                }
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification Code has Expired, Please signup again to get a new code"
                },
                {
                    status:400
                }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification code"
                },
                {
                    status:400
                }
            )
              
        }

    } catch (error) {
        console.log("Error verifying code", error)
        return Response.json({
            success: false,
            message: "Error verifying code"
        }, { status: 500 })
    }
}