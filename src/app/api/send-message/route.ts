import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/dbConnect';
import UserModel, { Message } from '@/src/model/User';
import uploadFileOnCloudinary from '@/src/helpers/uploadOnCloudinary'; // Fixed import
import { cloudinaryDB } from '@/src/lib/cloudinary';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  await dbConnect();
  cloudinaryDB();

  try {
    // For App Router, we need to manually handle form data
    const formData = await request.formData();
    
    const username = formData.get('username') as string;
    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    if (!username || !content) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        { success: false, message: 'User is not accepting messages' },
        { status: 403 }
      );
    }

    let imageUrl: string | undefined;

    if (imageFile) {
      // First save the file temporarily
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Ensure temp directory exists
      //const tempDir = join(process.cwd(), 'temp');
      const tempDir = '/tmp'; // safe in serverless
      if (!existsSync(tempDir)) {
        await mkdir(tempDir, { recursive: true });
      }
      
      const tempFilePath = join(tempDir, imageFile.name);
      await writeFile(tempFilePath, buffer);
      
      // Now upload to cloudinary with proper parameters
      const uploadResult = await uploadFileOnCloudinary(
        {
          name: imageFile.name,
          mimetype: imageFile.type,
          tempFilePath: tempFilePath,
        },
        'user_messages'
      );

      imageUrl = uploadResult?.secure_url;
    }

    const newMessage: Partial<Message> = {
      content,
      createdAt: new Date(),
      image: imageUrl,
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Unexpected Error Occurred:', error);
    return NextResponse.json(
      { success: false, message: 'Unexpected Error Occurred' },
      { status: 500 }
    );
  }
}