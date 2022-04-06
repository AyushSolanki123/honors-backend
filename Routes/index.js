const router = require('express').Router()

router.use('/api/user', require('./UserRoutes'))
router.use('/api/product', require('./ProductRoutes'))

router.get('/api', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/18650639/UVsPQ59W')
})

router.get('/', (req, res) => {
  res.redirect('/api')
})

module.exports = router
