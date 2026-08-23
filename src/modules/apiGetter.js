class ApiGetter {
    constructor (app) {
        this.app = app
    }

    newGetter (method, path, func) {
        this.app[method](path, func)
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