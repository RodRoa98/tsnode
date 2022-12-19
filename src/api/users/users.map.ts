import { passwordEncrypt } from '../auth/auth.service';
import { IUser } from './users.interface';

export const parseUserEmailReq = (userReq, { message, subject }) => ({
  email: userReq.email,
  message,
  subject,
});

export const parseRegisterReq = (user: Partial<IUser>) => ({
  ...user,
  password: passwordEncrypt(user.password),
});
