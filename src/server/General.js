import api from "../api.js";
import DcgDB from "../util/db.js";
import { DB_SECRET } from "../util/env.js";

const DB = new DcgDB("dcg", "general", DB_SECRET)

api.newGetter("get", "/general/", (req, res) => {
    return api.responseJson(res, 200, {
        ok: true,
        result: {
            name: "genAPI",
            version: "1.0.0",
            author: "dcg"
        }
    })
})
