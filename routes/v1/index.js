const router = require('express').Router()
const { index } = require('../../controllers/chatController')
const { update ,login, register} = require('../../controllers/userController')
const { auth } = require('../../middlewares/auth')
const { userFile } = require('../../middlewares/fileUpload')
// login & register && no need auth
router.post('/login',  login)
router.post('/register', register)



// need auth
router.get('/', index)
// user
router.post('/update', [auth, userFile], update)
router.get('/home', (req, res) => {
    return res.send('Home screen')
})

module.exports = router