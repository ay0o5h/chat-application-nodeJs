const models = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../models')
const User = models.User
const Chat = models.Chat
const ChatUser = models.ChatUser
const Message = models.Message 
const { okRes, errRes } = require('../tools/util.services')
exports.index = async (req, res) => {

    const user = await User.findOne({
        where: {
            id: req.user.id
        },
        include: [
            {
                model: Chat,
                include: [
                    {
                        model: User,
                        where: {
                            [Op.not]: {
                                id: req.user.id
                            }
                        }
                    },
                    {
                        model: Message,
                        include: [
                            {
                                model: User
                            }
                        ],
                        limit: 20,
                        order: [['id', 'DESC']]
                    }
                ]
            }
        ]
    })

    return okRes(res,{data:user.Chats})
}
exports.create = async (req, res) => {

    const { partnerId } = req.body

    const t = await sequelize.transaction()

    try {

        const user = await User.findOne({
            where: {
                id: req.user.id
            },
            include: [
                {
                    model: Chat,
                    where: {
                        type: 'dual'
                    },
                    include: [
                        {
                            model: ChatUser,
                            where: {
                                userId: partnerId
                            }
                        }
                    ]
                }
            ]
        })

        if (user && user.Chats.length > 0)
            return errRes(res,{ message: 'Chat with this user already exists!' })

        const chat = await Chat.create({ type: 'dual' }, { transaction: t })

        await ChatUser.bulkCreate([
            {
                chatId: chat.id,
                userId: req.user.id
            },
            {
                chatId: chat.id,
                userId: partnerId
            }
        ], { transaction: t })


        await t.commit()


        const creator = await User.findOne({
            where: {
                id: req.user.id
            }
        })

        const partner = await User.findOne({
            where: {
                id: partnerId
            }
        })

        const forCreator = {
            id: chat.id,
            type: 'dual',
            Users: [partner],
            Messages: []
        }

        const forReceiver = {
            id: chat.id,
            type: 'dual',
            Users: [creator],
            Messages: []
        }


        return okRes(res,{forCreator, forReceiver})

    } catch (e) {
        await t.rollback()
        return errRes(res,{ message: e.message },500)
    }
}

exports.messages = async (req, res) => {

    const limit = 10
    const page = req.query.page || 1
    const offset = page > 1 ? page * limit : 0

    const messages = await Message.findAndCountAll({
        where: {
            chatId: req.query.id
        },
        include: [
            {
                model: User
            }
        ],
        limit,
        offset,
        order: [['id', 'DESC']]
    })

    const totalPages = Math.ceil(messages.count / limit)

    if (page > totalPages) return okRes(res,{ data: { messages: [] } })

    const result = {
        messages: messages.rows,
        pagination: {
            page,
            totalPages
        }
    }

    return okRes(res,{result})
}
exports.imageUpload = (req, res) => {
    if (req.file) {
        return okRes({ url: req.file.filename })
    }

    return errRes({ msg: 'No image uploaded' })
}
exports.deleteChat = async (req, res) => {

    const { id } = req.params

    try {
        const chat = await Chat.findOne({
            where: {
                id
            },
            include: [
                {
                    model: User
                }
            ]
        })

        const notifyUsers = chat.Users.map(user => user.id)

        await chat.destroy()
        return okRes(res,{ chatId: id, notifyUsers })

    } catch (e) {
        return errRes(res,{ message: e.message })
    }
}


exports.addUserToGroup = async (req, res) => {
    try {

        const { chatId, userId } = req.body

        const chat = await Chat.findOne({
            where: {
                id: chatId
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Message,
                    include: [
                        {
                            model: User
                        }
                    ],
                    limit: 20,
                    order: [['id', 'DESC']]
                }
            ]
        })

        chat.Messages.reverse()

        // check if already in the group
        chat.Users.forEach(user => {
            if (user.id === userId) {
                return errRes(res,{ message: 'User already in the group!' })
            }
        })

        await ChatUser.create({ chatId, userId })

        const newChatter = await User.findOne({
            where: {
                id: userId
            }
        })

        if (chat.type === 'dual') {
            chat.type = 'group'
            chat.save()
        }

        return okRes(res,{ chat:chat, newChatter:newChatter })

    } catch (e) {
        return errRes(res,{ status: 'Error', message: e.message })
    }
}

exports.leaveCurrentChat = async (req, res) => {

    try {
        const { chatId } = req.body
        const chat = await Chat.findOne({
            where: {
                id: chatId
            },
            include: [
                {
                    model: User
                }
            ]
        })

        if (chat.Users.length === 2) {
            return errRes(res,{ status: 'Error', message: 'You cannot leave this chat' })

        }

        if (chat.Users.length === 3) {
            chat.type = 'dual'
            chat.save()
        }

        await ChatUser.destroy({
            where: {
                chatId,
                userId: req.user.id
            }
        })

        await Message.destroy({
            where: {
                chatId,
                fromUserId: req.user.id
            }
        })

        const notifyUsers = chat.Users.map(user => user.id)

        return okRes(res,{ chatId: chat.id, userId: req.user.id, currentUserId: req.user.id, notifyUsers })

    } catch (e) {
        return errRes(res,{ status: 'Error', message: e.message })
    }
}

