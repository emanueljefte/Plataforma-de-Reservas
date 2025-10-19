import express from 'express'
import { authenticate} from '../middlewares/authenticate'
import { authorize} from '../middlewares/authorize'
import {
  postService,
  getServices,
  getService,
  putService,
  deleteService,
  getUserServices
} from '../controllers/servicesController'

export const router: express.Router = express.Router()

router.post('/', authenticate, authorize(["create"], "Provider"), postService)
router.get('/', authenticate, authorize(['read']), getServices)
router.get('/all-user-services/:id', authenticate, authorize(['read']), getUserServices)
router.get('/:id', authenticate, authorize(['read']), getService)
router.put('/:id', authenticate, authorize(['update'], 'Provider'), putService)
router.delete('/:id', authenticate, authorize(['delete'], 'Provider'), deleteService)