import express from 'express';
import { createUser, removeUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser)

router.delete('/:id', removeUser);

export default router;
