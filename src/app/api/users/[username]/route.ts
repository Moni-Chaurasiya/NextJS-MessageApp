
import { NextResponse } from 'next/server';
import UserModel from '@/src/model/User';
import { ApiResponse } from '@/src/types/ApiResponse';

export async function GET(_request: Request, { params }: { params: { username: string } }) {
  const { username } = params;

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not not found',
        user: undefined,
        error: ''
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'User found',
      user: {
        username: user.username,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      error: ''
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal Server Error',
      user: undefined,
      error: ''
    };
    return NextResponse.json(response, { status: 500 });
  }
}