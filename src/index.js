import api from "./api.js";
import DcgDB from "./util/db.js";
import { securityCheck } from "./security.js";

api.securityCheck = securityCheck.generate()

api.newGetter("get", "/", (req, res) => {
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: "DcgApi",
            version: "1.0.0",
            author: "dcg"
        }
    })
})