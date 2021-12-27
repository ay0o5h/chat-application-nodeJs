const router = require('express').Router()
const { index,create,messages,deleteChat,imageUpload ,addUserToGroup,leaveCurrentChat} = require('../../controllers/chatController')
const { update ,login, register,getProfile,search} = require('../../controllers/userController')
const { auth } = require('../../middlewares/auth')
const { userFile ,chatFile} = require('../../middlewares/fileUpload')
// login & register && no need auth
router.post('/login',  login)
router.post('/register', register)

// need auth
router.get('/chats', auth, index)
router.get("/chat/messages",auth,messages)
router.post('/create', auth, create)
router.delete('/delete/:id', auth, deleteChat)
router.post('/upload-image', [auth, chatFile], imageUpload)
router.post('/add-user-to-group', auth, addUserToGroup)
router.post('/leave-current-chat', auth, leaveCurrentChat)

// user
router.get('/profile', auth, getProfile)
router.put('/update', [auth, userFile], update)
router.get('/search-users', auth, search)


module.exports = router