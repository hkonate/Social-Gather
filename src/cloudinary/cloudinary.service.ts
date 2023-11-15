import { Injectable, ConflictException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `SocialGather/${userId}/Avatar` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.fieldname).pipe(uploadStream);
    });
  }

  async deleteFolder(path: string) {
    try {
      const deletedImages =
        await cloudinary.api.delete_resources_by_prefix(path);
      const deletedFolder = await cloudinary.api.delete_folder(path);
      return { deletedImages, deletedFolder };
    } catch (error) {
      throw new ConflictException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
  }
}
