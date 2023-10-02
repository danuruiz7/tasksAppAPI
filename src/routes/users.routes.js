import { Router } from 'express';
import { createUser, loginUser } from '../controllers/users.controller.js';

const router = Router();

router.post('/register', createUser);

router.post('/login', loginUser);

export default router;
