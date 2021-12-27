const multer = require('multer')
const fs = require('fs')
const path = require('path')

const getFileType = (file) => {
    const mimeType = file.mimetype.split('/')
    return mimeType[mimeType.length - 1]
}
const generateFileName = (req, file, cb) => {
    const extension = getFileType(file)

    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
    cb(null, file.fieldname + '-' + filename)
}
exports.userFile = ((req, res, next) => {
       const { id } = req.user
    const storage = multer.diskStorage({   
        destination: `uploads/user/${id}`,
        filename: generateFileName
    })
    return multer({ storage,limits: {
        fileSize: 2000000 // 1000000 Bytes = 1 MB
    },  fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    } }).single('avatar')
})()
exports.chatFile = ((req, res, next) => {

   const { id } = req.body
    const storage = multer.diskStorage({   
        destination: `uploads/chat/${id}`,
        filename: generateFileName
    })
     return multer({ storage,limits: {
        fileSize: 2000000 // 1000000 Bytes = 1 MB
    },  fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    } }).single('image')
})()
 