const { Router } = require('express')

const SalesController = require('../controllers/SalesController')

const salesRoutes = Router()

const salesController = new SalesController()

salesRoutes.post('/', salesController.create);
salesRoutes.put('/:id', salesController.update);
salesRoutes.get('/', salesController.index);
salesRoutes.get('/:id', salesController.show);
salesRoutes.delete('/:id', salesController.delete);


module.exports = salesRoutes
