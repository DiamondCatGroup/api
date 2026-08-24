import api from "./api.js";
import DcgDB from "./util/db.js";
import express from "express";
import { securityCheck } from "./security.js";

api.use(express.json({ limit: "4mb" }))
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

api.start("0.0.0.0", "8602")