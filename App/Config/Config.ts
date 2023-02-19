import { config as dotenv } from 'dotenv';
import * as multer from 'multer';
import { Upfile } from '../../../../Apps/upfile/dist';
import { Middleware } from '../Core/Decorators';
import { NextFunction, Response } from 'express';

dotenv();

/**
 * Doesn't need to be class
 */
export class Config {
  private PORT: number = (process.env.PORT as unknown as number) || 3000;
  private DB_URL: string = process.env.DB_URL || '';
  private SECRET: string = process.env.SECRET || '';
  private static upAvatar: Upfile | null = null;

  get port(): number {
    return this.PORT;
  }

  get dbUrl(): string {
    return this.DB_URL;
  }

  get secret(): string {
    return this.SECRET;
  }

  // TODO: Better filename....
  static storage(folder: string): multer.StorageEngine {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/' + folder);
      },
      filename: function (req, file, cb) {
        const ext = '.' + file.mimetype.split('/')[1];
        cb(null, Date.now() + ext);
      },
    });
  }

  static resource(folder: string) {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/' + folder);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + `-${file.originalname}`);
      },
    });
  }

  static uploadAvatar(req: any, res: any, next: any): any {
    if ( Config.upAvatar === null ) {
      Config.upAvatar = new Upfile('uploads/avatars');
    }

    Config.upAvatar?.parseIncomingBody(req, res, next);
  }
}
