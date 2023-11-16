import { Injectable, ConflictException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    userId: string,
    path: string
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `SocialGather/${userId}/${path}` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(path: string): Promise<CloudinaryResponse> {
    try {
      const deletedImage: CloudinaryResponse =
        await cloudinary.uploader.destroy(path);
      return deletedImage;
    } catch (error) {
      throw new ConflictException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
  }

  async deleteFolder(path: string): Promise<CloudinaryResponse> {
    try {
      const deletedImages: CloudinaryResponse =
        await cloudinary.api.delete_resources_by_prefix(path);
      const deletedFolder: CloudinaryResponse =
        await cloudinary.api.delete_folder(path);
      return { ...deletedImages, ...deletedFolder };
    } catch (error) {
      throw new ConflictException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
  }
}
