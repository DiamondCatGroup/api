import cors from "cors"
import cookieParser from "cookie-parser"

class ApiGetter {
    constructor (app) {
        this.app = app
        this.rateLimit = (req, res, next) => { next() }
        this.securityCheck = (req, res, next) => { next() }
        this.cors = []
        this.credentials = false
    }

    newGetter (method, path, func) {
        this.app[method](path, this.rateLimit, func)
    }

    responseJson (res, code, resp) {
        return res.status(code).json(Object(resp))
    }

    responseSend (res, code, resp) {
        return res.status(code).send(resp)
    }

    start (IP, PORT, handle) {
        this.app.listen(PORT, IP, handle || (() => { console.log(`PORT ${PORT}, IP ${IP}`) }))
    }

    use (expJson) {
        this.app.use(
            expJson,
            cors({
		        origin: this.cors,
		        credentials: this.credentials
	        }),
            cookieParser()
        )
    }
}

export {
    ApiGetter as default
}