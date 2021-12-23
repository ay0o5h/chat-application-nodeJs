const router = require('express').Router()
const { index,create,messages,deleteChat,imageUpload } = require('../../controllers/chatController')
const { update ,login, register,getProfile} = require('../../controllers/userController')
const { auth } = require('../../middlewares/auth')
const { userFile ,chatFile} = require('../../middlewares/fileUpload')
// login & register && no need auth
router.post('/login',  login)
router.post('/register', register)



// need auth
router.get('/chats', auth, index)
router.get("/chat/messages",auth,messages)
router.post('/create', auth, create)
router.post('/upload-image', [auth, chatFile], imageUpload)
router.delete('/delete/:id', auth, deleteChat)


// user
router.get('/profile', auth, getProfile)
router.put('/update', [auth, userFile], update)
router.get('/home', (req, res) => {
    return res.send('Home screen')
})

module.exports = router