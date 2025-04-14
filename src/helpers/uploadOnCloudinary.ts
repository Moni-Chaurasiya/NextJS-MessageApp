
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Define types for function arguments explicitly
interface File {
  name: string;
  mimetype: string;
  tempFilePath: string;
}

// Function arguments type definition
const uploadFileOnCloudinary = async (
  file: File | null | undefined,
  folder: string,
  height?: number,
  quality?: number
): Promise<UploadApiResponse | null> => {
  try {
    if (!file || !folder) {
      return null;
    }

    const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
    const sanitizedFileName = fileNameWithoutExtension.replace(/\s+/g, '_');

    const options: UploadApiOptions = {
      folder,
      resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'auto',
      type: 'upload',
    };

    if (file.mimetype === 'application/pdf') {
      options.public_id = sanitizedFileName;
    }

    if (height) {
      options.height = height;
    }

    if (quality) {
      options.quality = quality;
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error('Error while uploading file to Cloudinary:', error);
    throw error; // Better to throw the error instead of exiting the process
  }
};

export default uploadFileOnCloudinary;