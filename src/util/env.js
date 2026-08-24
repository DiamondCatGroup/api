import config from "../../config.js"

const { DB_SECRET } = process.env
const { DB_IP, DB_PORT } = config.env
const DB_URL = [DB_IP, ":", DB_PORT]

export {
    DB_IP,
    DB_PORT,
    DB_SECRET,
    DB_URL
}