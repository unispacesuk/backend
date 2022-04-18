import { compare, hash } from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 10);
};
const compareHash = async (password = 'null', digest: string) => {
  return await compare(password, digest);
};

export { hashPassword, compareHash };
