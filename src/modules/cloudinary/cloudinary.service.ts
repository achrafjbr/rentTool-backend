import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: 'image',
        },

        (error, result) => {
          console.log('Cloudinary callback reached');

          if (error) {
            console.error('Cloudinary error:', error);
            return reject(error);
          }
          console.log('Cloudinary success:', result?.secure_url);

          resolve(result!);
        },
      );
      //       streamifier.createReadStream(file.buffer).pipe(uploadStream);
      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicPictureId: string) {
    try {
      await cloudinary.uploader.destroy(publicPictureId, {
        resource_type: 'image',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Something went wrong, try again...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
