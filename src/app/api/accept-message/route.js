import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/src/lib/dbConnect"
import UserModel from "@/src/model/User"
//import { User } from "next-auth"


export async function POST(request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }
    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept message"
                },
                { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("failed to update user status to accept message")
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept message"
            },
            { status: 500 }
        )
    }
}


export async function GET(_request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated"
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const userId = user._id;
        const userFound = await UserModel.findById(userId);

        if (!userFound) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                isAcceptingMessage: userFound.isAcceptingMessage
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error occurred while fetching message settings:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error occurred while fetching message settings"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

// export async function GET(request) {
//     await dbConnect();

//     const session = await getServerSession(authOptions)
//     const user = session?.user 

//     if (!session || !session.user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "Not Authenticated"
//             },
//             { status: 401 }
//         )
//     }
    
//     try {
//         const userId = user._id;
        
//         const userFound = await UserModel.findById(userId)
    
//         if (!userFound) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "failed to found the user"
//                 },
//                 { status: 403 }
//             )
//         }
    
//         return Response.json(
//             {
//                 success: true,
//                 isAcceptingMessage: userFound.isAcceptingMessage
//             },
//             { status: 200 }
//         )

//     } catch (error) {
//         console.log("Error occur while accepting Message")
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error occur while accepting Message"
//             },
//             { status: 500 }
//         )
//     }

// }
