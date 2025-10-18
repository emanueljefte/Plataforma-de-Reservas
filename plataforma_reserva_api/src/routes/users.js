import express from 'express'
import { authenticate } from '../middlewares/authenticate.js'
export const router = express.Router()


import {register, login, getUsers, putUser, deleteUser, getUserByID, getUserByEmail, getUserByNif, putUserPassword, putUserBalance} from '../controllers/usersController.js'
router.post('/register', register)
router.post('/login', login)
router.get('/', getUsers)
router.get('/by-email/:email', authenticate, getUserByEmail)
router.get('/by-id/:id', authenticate, getUserByID)
router.get('/by-nif/:nif', authenticate, getUserByNif)
router.put('/:id', authenticate, putUser)
router.put('/transaction/:id', authenticate, putUserBalance)
router.put('/resetPassword/:id', authenticate, putUserPassword)
router.delete('/:id', authenticate, deleteUser)

