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
     
    const storage = multer.diskStorage({   
        destination:function (req, file, cb) {
            const { id } = req.user
            const dest = `uploads/user/${id}`
              fs.access(dest, (error) => {

                // if doens't exist
                if (error) {
                    return fs.mkdir(dest, (error) => {
                        cb(error, dest)
                    })
                } else {
                    // it does exist
                    fs.readdir(dest, (error, files) => {
                        if (error) throw error

                        for (const file of files) {
                            fs.unlink(path.join(dest, file), error => {
                                if (error) throw error
                            })
                        }
                    })

                    return cb(null, dest)
                }
            })
        },
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
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const { id } = req.body
            const dest = `uploads/chat/${id}`
            fs.access(dest, (error) => {

                // if doens't exist
                if (error) {
                    return fs.mkdir(dest, (error) => {
                        cb(error, dest)
                    })
                } else {
                    return cb(null, dest)
                }
            })
        },
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
 