import api from "../api.js";
import DcgDB from "../util/db.js";
import { DB_SECRET } from "../util/env.js";
import { User, Result, Chat } from "scratchssenger/src/help/class.js"

const DB = new DcgDB("dcg", "scratchssenger", DB_SECRET)

api.newGetter("get", "/scratchssenger/", (req, res) => {
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: "ScratchssengerAPI",
            version: "1.0.0",
            author: "dcg"
        }
    })
})

api.newGetter("post", "/scratchssenger/session/", async (req, res) => {
    try {
        const { login, session } = req.body
        const indexUsers = JSON.parse(await DB.read("/users/index.json"))
        if (!Object.keys(indexUsers).includes(login)) {
            return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
        }
        const user = new User(indexUsers[login])
        if (user.session !== session) {
            return api.responseJson(res, 403, new Result(false, { error: "token is fake" }))
        }
        const isActual = await user.checkSession()
        if (!isActual) {
            return api.responseJson(res, 403, new Result(false, { error: "token is old" }))
        }
        const userJSON = user.JSON

        return api.responseJson(res, 200, {
            ok: true,
            result: {
                name: userJSON.name,
                username: userJSON.username,
                id: userJSON.id,
                joinedAt: user.joined,
                lastActive: user.active,
                role: user.role
            }
        })
    } catch (error) {
        const IP = req.headers["x-forwarded-for"]
        console.error("New error in getting session by IP: ", IP)
        console.error(error)
        console.error(new Date())
        return api.responseJson(res, 500, {
            ok: false,
            error: "Interal Server Error",
            errorMessage: error.message,
            ip: IP
        })
    }
})

api.newGetter("post", "/scratchssenger/session/chats/", async (req, res) => {
    try {
        const { login, session } = req.body
        const indexUsers = JSON.parse(await DB.read("/users/index.json"))
        if (!Object.keys(indexUsers).includes(login)) {
            return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
        }
        const user = new User(indexUsers[login])
        if (user.session !== session) {
            return api.responseJson(res, 403, new Result(false, { error: "token is fake" }))
        }
        const isActual = await user.checkSession()
        if (!isActual) {
            return api.responseJson(res, 403, new Result(false, { error: "token is old" }))
        }
        const userChats = user.chats

        return api.responseJson(res, 200, {
            ok: true,
            result: userChats
        })
    } catch (error) {
        const IP = req.headers["x-forwarded-for"]
        console.error("New error in getting user chats by IP: ", IP)
        console.error(error)
        console.error(new Date())
        return api.responseJson(res, 500, {
            ok: false,
            error: "Interal Server Error",
            errorMessage: error.message,
            ip: IP
        })
    }
})

api.newGetter("get", "/scratchssenger/users/:target/", async (req, res) => {
    const { target } = req.params
    const indexUsers = JSON.parse(await DB.read("/users/index.json"))
    if (!Object.keys(indexUsers).includes(target)) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const user = new User(indexUsers[target])
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: user.name,
            username: user.username,
            id: user.id,
            joinedAt: user.joined,
            lastActive: user.active
        }
    })
})

api.newGetter("post", "/scratchssenger/chats/:target/", async (req, res) => {
    const { target } = req.params
    const { login, session } = req.body
    const indexChats = JSON.parse(await DB.read("/chats/index.json"))
    if (!Object.keys(indexChats).includes(target)) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const chat = new Chat(indexChats[target])
    if (chat.accessType === "private") {
        const indexUsers = JSON.parse(await DB.read("/users/index.json"))
        if (!Object.keys(indexUsers).includes(login)) {
            return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
        }
        const user = new User(indexUsers[login])
        if (user.session !== session) {
            return api.responseJson(res, 403, new Result(false, { error: "token is fake" }))
        }
        const isActual = await user.checkSession()
        if (!isActual) {
            return api.responseJson(res, 403, new Result(false, { error: "token is old" }))
        }
        if (!chat.members.includes(login) ) {
            return api.responseJson(res, 403, new Result(false, { error: "you is not in this chat" })) 
        }
        return api.responseJson(res, 200, {
            ok: true,
            result: {
                name: chat.name,
                username: chat.username,
                id: chat.id,
                admins: chat.admins,
                members: chat.members,
                type: chat.type
            }
        })
    }
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: chat.name,
            username: chat.username,
            id: chat.id,
            admins: chat.admins,
            members: chat.members,
            type: chat.type
        }
    })
})

api.newGetter("post", "/scratchssenger/chats/:target/messages", async (req, res) => {
    const { target } = req.params
    const { login, session } = req.body
    const indexChats = JSON.parse(await DB.read("/chats/index.json"))
    if (!Object.keys(indexChats).includes(target)) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const chat = new Chat(indexChats[target])
    if (chat.accessType === "private") {
        const indexUsers = JSON.parse(await DB.read("/users/index.json"))
        if (!Object.keys(indexUsers).includes(login)) {
            return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
        }
        const user = new User(indexUsers[login])
        if (user.session !== session) {
            return api.responseJson(res, 403, new Result(false, { error: "token is fake" }))
        }
        const isActual = await user.checkSession()
        if (!isActual) {
            return api.responseJson(res, 403, new Result(false, { error: "token is old" }))
        }
        if (!chat.members.includes(login) ) {
            return api.responseJson(res, 403, new Result(false, { error: "you is not in this chat" })) 
        }
        return api.responseJson(res, 200, {
            ok: true,
            result: chat.messages
        })
    }
    return api.responseJson(res, 200, {
        ok: true,
        result: chat.messages
    })
})

api.newGetter("post", "/scratchssenger/chats/:target/join", async (req, res) => {
    const { target } = req.params
    const { login, session } = req.body
    const indexChats = JSON.parse(await DB.read("/chats/index.json"))
    if (!Object.keys(indexChats).includes(target)) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const chat = new Chat(indexChats[target])
    const indexUsers = JSON.parse(await DB.read("/users/index.json"))
    if (!Object.keys(indexUsers).includes(login)) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const user = new User(indexUsers[login])
    if (user.session !== session) {
        return api.responseJson(res, 403, new Result(false, { error: "token is fake" }))
    }
    const isActual = await user.checkSession()
    if (!isActual) {
        return api.responseJson(res, 403, new Result(false, { error: "token is old" }))
    }
    if (chat.members.includes(login) ) {
        return api.responseJson(res, 404, new Result(false, { error: "you is in this chat" })) 
    }
    chat.members.push(user.id)
    return api.responseJson(res, 200, {
        ok: true
    })
})

api.newGetter("get", "/scratchssenger/users/id/:target/", async (req, res) => {
    const target = Number(req.params.target)
    const indexUsers = JSON.parse(await DB.read("/users/index.json"))
    if (!Object.keys(indexUsers).length < target) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const user = new User(indexUsers[Object.keys(indexUsers)[target-1]])
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: user.name,
            username: user.username,
            id: user.id,
            joinedAt: user.joined,
            lastActive: user.active
        }
    })
})

api.newGetter("post", "/scratchssenger/chats/id/:target/", async (req, res) => {
    const target = Number(req.params.target)
    const { login, session } = req.body
    const indexChats = JSON.parse(await DB.read("/chats/index.json"))
    if (Object.keys(indexChats).length+1 < target) {
        return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
    }
    const chat = new Chat(indexChats[Object.keys(indexChats)[target-1]])
    if (chat.accessType === "private") {
        const indexUsers = JSON.parse(await DB.read("/users/index.json"))
        if (!Object.keys(indexUsers).includes(login)) {
            return api.responseJson(res, 404, new Result(false, { error: "account not found" }))
        }
        const user = new User(indexUsers[login])
        if (user.session !== session) {
            return api.responseJson(res, 403, new Result(false, { error: "token is fake" }))
        }
        const isActual = await user.checkSession()
        if (!isActual) {
            return api.responseJson(res, 403, new Result(false, { error: "token is old" }))
        }
        if (!chat.members.includes(login) ) {
            return api.responseJson(res, 403, new Result(false, { error: "you is not in this chat" })) 
        }
        return api.responseJson(res, 200, {
            ok: true,
            result: {
                name: chat.name,
                username: chat.username,
                id: chat.id,
                admins: chat.admins,
                members: chat.members,
                type: chat.type
            }
        })
    }
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: chat.name,
            username: chat.username,
            id: chat.id,
            admins: chat.admins,
            members: chat.members,
            type: chat.type
        }
    })
})