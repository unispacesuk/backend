import {Request} from "express";

export interface MoreRequest<T = string> extends Request {
  some?: T;
}