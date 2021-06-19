import { Router } from 'express';

import { ConfirmUserController } from '@modules/users/useCases/confirmUser/ConfirmUserController';
import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { UpdateUserController } from '@modules/users/useCases/updateUser/UpdateUserController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const userRoutes = Router();

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const confirmUserController = new ConfirmUserController();

userRoutes.post('/', createUserController.handle);
userRoutes.put('/:id', ensureAuthenticated, updateUserController.handle);
userRoutes.patch('/verify/:token', confirmUserController.handle);

export { userRoutes };
