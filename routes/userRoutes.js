import express from 'express';
import { createUser, removeUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/create', createUser)

router.delete('/delete/:id', removeUser);

export default router;
