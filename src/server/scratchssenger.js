import api from "../api.js";
import DcgDB from "../util/db.js";
import { DB_SECRET } from "../util/env.js";
import { User, Result } from "scratchssenger/src/help/class.js"

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

api.newGetter("get", "/scratchssenger/session/", async (req, res) => {
    try {
        const { login, session } = req.body
        const indexUsers = JSON.parse(DB.read("/users/index.json"))
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
                id: userJSON.id
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

api.newGetter("get", "/scratchssenger/session/chats/", async (req, res) => {
    try {
        const { login, session } = req.body
        const indexUsers = JSON.parse(DB.read("/users/index.json"))
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