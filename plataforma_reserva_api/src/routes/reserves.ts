import express from 'express'
import { authenticate} from '../middlewares/authenticate'
import { authorize} from '../middlewares/authorize'
import {
  postReserve,
  getReserves,
  getReserve,
  putReserve,
  deleteReserve,
  getUserReserves,
} from '../controllers/reservesController'

export const router: express.Router = express.Router()

router.post('/', authenticate, authorize(["create"], "Client"), postReserve)
router.get('/', authenticate, authorize(['read']), getReserves)
router.get('/history', authenticate, authorize(['read']), getUserReserves)
router.get('/:id', authenticate, authorize(['read']), getReserve)
router.put('/:id', authenticate, authorize(['update'], "Client"), putReserve)
router.delete('/:id', authenticate, authorize(['delete'], "Client"), deleteReserve)