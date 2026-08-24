class ApiGetter {
    constructor (app) {
        this.app = app
        this.rateLimit = (req, res, next) => { next() }
        this.securityCheck = (req, res, next) => { next() }
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
}

export {
    ApiGetter as default
}