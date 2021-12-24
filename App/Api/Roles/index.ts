import { Router } from 'express';
import { RolesController } from './RolesController';

const Roles: Router = Router();
export { Roles };

Roles.use('/roles', [new RolesController().route]);
