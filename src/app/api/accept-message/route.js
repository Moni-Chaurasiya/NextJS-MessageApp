import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    // const user: User = session?.user as User
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
    const { acceptMessage } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessage },
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

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

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

    try {
        
        const userFound = await UserModel.findById(userId)
    
        if (!userFound) {
            return Response.json(
                {
                    success: false,
                    message: "failed to found the user"
                },
                { status: 403 }
            )
        }
    
        return Response.json(
            {
                success: true,
                isAcceptingMessage: userFound.isAcceptingMessage
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error occur while accepting Message")
        return Response.json(
            {
                success: false,
                message: "Error occur while accepting Message"
            },
            { status: 500 }
        )
    }

}
