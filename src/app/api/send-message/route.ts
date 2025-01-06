/*
import dbConnect from "@/src/lib/dbConnect"
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User"

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json();
    console.log(username)
    try {
        const user = await UserModel.findOne({ username }).exec()
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found "
            },
                { status: 401 }
            )
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
              { message: 'User is not accepting messages', success: false },
              { status: 403 } // 403 Forbidden status
            );
          }
        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage as Message)

        await user.save();

        return Response.json({
            success: true,
            message: " Message send successfully"
        },
            { status: 200 }
        )

    } catch (error) {
        console.log("Unexpected Error Occur", error)
        return Response.json({
            success: false,
            message: "Unexpected Error Occur"
        }, { status: 500 })

    }
}
    */
   
import dbConnect from '@/src/lib/dbConnect';
import UserModel from '@/src/model/User';
import { Message } from '@/src/model/User';

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not not not found',
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected Error Occurred', error);
    return Response.json(
      {
        success: false,
        message: 'Unexpected Error Occurred',
      },
      { status: 500 }
    );
  }
}