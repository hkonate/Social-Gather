import { Injectable, ConflictException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    userId: string,
    path: string,
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
  async deleteFiles(userId: string, path: string): Promise<CloudinaryResponse> {
    try {
      const deletedImages: CloudinaryResponse =
        await cloudinary.api.delete_resources_by_prefix(
          `SocialGather/${userId}/${path}`,
        );

      return deletedImages;
    } catch (error) {
      throw new ConflictException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
  }

  async deleteFolders(userId: string): Promise<CloudinaryResponse> {
    try {
      let deleteDetails: CloudinaryResponse;
      const avatarFolder = await cloudinary.search
        .expression(`SocialGather/${userId}/Avatar`)
        .execute();
      if (avatarFolder.total_count > 0) {
        deleteDetails = {
          ...(await cloudinary.api.delete_resources_by_prefix(
            `SocialGather/${userId}/Avatar`,
          )),
          ...(await cloudinary.api.delete_folder(
            `SocialGather/${userId}/Avatar`,
          )),
        };
      }
      const chatFolder = await cloudinary.search
        .expression(`SocialGather/${userId}/Chat`)
        .execute();
      if (chatFolder.total_count > 0) {
        deleteDetails = {
          ...deleteDetails,
          ...(await cloudinary.api.delete_resources_by_prefix(
            `SocialGather/${userId}/Chat`,
          )),
          ...(await cloudinary.api.delete_folder(
            `SocialGather/${userId}/Chat`,
          )),
        };
      }
      const eventFolder = await cloudinary.search
        .expression(`SocialGather/${userId}/Event`)
        .execute();

      if (eventFolder.total_count > 0) {
        deleteDetails = {
          ...deleteDetails,
          ...(await cloudinary.api.delete_resources_by_prefix(
            `SocialGather/${userId}/Event`,
          )),
          ...(await cloudinary.api.delete_folder(
            `SocialGather/${userId}/Event`,
          )),
        };
      }

      return deleteDetails;
    } catch (error) {
      throw new ConflictException({
        message: error.message,
        statusCode: error.http_code,
      });
    }
  }
}
