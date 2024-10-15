import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(imageBase64: string): Promise<{
    name: string;
    secure_url: string;
  }> {
    try {
      const response = await cloudinary.uploader.upload(imageBase64, {
        folder: 'iot_images',
        unique_filename: true,
      });
      return  {
        name:  response.public_id,
        secure_url: response.secure_url
      };
    } catch (error) {
      throw new Error('Error uploading image to Cloudinary');
    }
  }
}