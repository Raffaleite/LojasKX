const { Router } = require('express')

const usersRoutes = require('./users.routes')
const salesRoutes = require('./sales.routes')

const routes = Router()
routes.use('/users', usersRoutes)
routes.use('/sales', salesRoutes)

module.exports = routes
