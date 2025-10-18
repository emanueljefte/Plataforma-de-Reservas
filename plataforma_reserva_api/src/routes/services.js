import express from 'express'
const router = express.Router()

import {} from '../controllers/servicesController.js'
router.post('/', addService)
router.get('/', services.getServices)
router.get('/:id', services.getService)
router.put('/:id', services.putService)
router.delete('/:id', services.deleteService)

module.exports = router