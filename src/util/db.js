import api from "../api.js";
import { DB_URL } from "./env.js";

class DcgDB {

    #DB_SECRET = ""

    constructor (project, DB_SECRET) {
        this.group = "dcg"
        this.project = project
        this.#DB_SECRET = DB_SECRET
    }

    write (file, content) {}

    read (file) {}
}

export {
    DcgDB as default
}