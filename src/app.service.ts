import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status:"vivo",
      message:"Hello World",
    };
  }
}
