import { getServerSession} from "next-auth/next";
import { authOptions} from "../auth/[...nextauth]/options"
import dbConnect from "@/src/lib/dbConnect"
import UserModel from "@/src/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";
export async function GET(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }
    const _user = session?.user as User
    if(!_user._id){
        return Response.json(
            {
                success:false,
                message:"UserId is missing"
            },
            {
                status:400
            }
        )
    }
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
         //   {$unwind:"$messages"},
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
            {$sort:{'messages.createAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ]).exec();

        /*

[
    {
        "_id": "12345",
        "id": "user123",
        "name": "John Doe",
        "messages": [
            { "text": "Hello", "createdAt": "2024-01-01T10:00:00Z" },
            { "text": "How are you?", "createdAt": "2024-01-02T12:00:00Z" }
        ]
    }
]
    {$unwind:"$messages"}
    This line will convert the above array in this form so that we can sort
        

[
    { "_id": "12345", "id": "user123", "messages": { "text": "Hello", "createdAt": "2024-01-01T10:00:00Z" } },
    { "_id": "12345", "id": "user123", "messages": { "text": "How are you?", "createdAt": "2024-01-02T12:00:00Z" } }
]
*/

/*
{$group:{_id:'$_id',messages:{$push:'$message'}}}

[
    {
        "_id": "12345",
        "messages": [
            { "text": "How are you?", "createdAt": "2024-01-02T12:00:00Z" },
            { "text": "Hello", "createdAt": "2024-01-01T10:00:00Z" }
        ]
    }
]
*/


        if(!user || user.length===0){
            return Response.json(
                {
                    success: false,
                    message: "User Not Not found"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
          { message: 'Internal server error', success: false },
          { status: 500 }
        );
        
    }

}