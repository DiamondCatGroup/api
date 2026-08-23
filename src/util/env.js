const { DB_NAME, DB_IP, DB_PORT, DB_SECRET } = process.env
const DB_URL = [DB_IP, ":", DB_PORT]

export {
    DB_NAME,
    DB_IP,
    DB_PORT,
    DB_SECRET,
    DB_URL
}