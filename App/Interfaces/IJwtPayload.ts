import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayload extends JwtPayload {
  _id?: string;
}
