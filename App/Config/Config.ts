import {config as dotenv} from "dotenv";

dotenv();

export class Config {

  private PORT: number = process.env.PORT as unknown as number || 3000;
  private DB_URL: string = process.env.DB_URL || '';

  get port(): number {
    return this.PORT;
  }

  get dbUrl(): string {
    return this.DB_URL;
  }

}