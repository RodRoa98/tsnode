import { Request, Response } from 'express';

import Logger from '../../lib/logger';
import { passwordCompare, passwordEncrypt } from '../auth/auth.service';
import BaseController from '../base.controller';
import User from './users.model';
import { to } from '../../helpers/fetch.helper';
import { BadRequest, Created, NotFound, Ok } from '../../helpers/http.helper';
import { SKIP_FIELDS } from '../../constants/general.constant';
import { throwBusinessError, throwDBError } from '../../helpers/error.helper';
import * as EmailService from '../../services/node-mailer';
import { parseRegisterReq, parseUserEmailReq } from './users.map';

const logger = Logger.getLogger('health-controller');

export default class UserController extends BaseController {
  constructor() {
    super(User);
  }

  public async register(req: Request, res: Response) {
    const { email } = req.body;
    const [_, userExist] = await to(User.findOne({ email }).exec());

    if (userExist) {
      throwBusinessError('That email is taken. Try another.');
    }

    const user = new User(parseRegisterReq(req.body));

    const [userErr, userRes] = await to(user.save());
    if (userErr) {
      throwDBError(userErr);
    }

    return Created(res, { id: userRes.id });
  }

  public async changePassword(req: Request, res: Response) {
    const id = +req.params.id;
    const { currentPassword, newPassword } = req.body;

    const [userErr, userRes] = await to(User.findOne({ id }, SKIP_FIELDS).exec());
    if (userErr) {
      throwDBError(userErr);
    }
    if (!userRes) {
      return NotFound(res);
    }

    if (!passwordCompare(currentPassword, userRes.password)) {
      return BadRequest(res, { message: 'Current password does not match' });
    }

    const hash = passwordEncrypt(newPassword);

    const [updateUserErr] = await to(User.findOneAndUpdate({ id }, { password: hash }).exec());
    if (updateUserErr) {
      throwDBError(updateUserErr);
    }

    const options = { message: 'Update password completed successfully', subject: 'Change password' };
    const [emailErr] = await to(EmailService.sendEmail(parseUserEmailReq(userRes, options)));

    if (emailErr) {
      logger.info('error sending email');
    }

    return Ok(res, { message: 'Password was updated successfully' });
  }
}
