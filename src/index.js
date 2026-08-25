import api from "./api.js";
import express from "express";
import { securityCheck } from "./security.js";

api.cors = ["https://scratchssenger.vercel.app", "localhost:8601", "localhost:8602", "127.0.0.1"]
api.use(express.json({ limit: "4mb" }))
api.securityCheck = securityCheck.generate()

import "./server/scratchssenger.js"

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

api.start("0.0.0.0", "8602")