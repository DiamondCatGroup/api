import api from "./api.js";

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