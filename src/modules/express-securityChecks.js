class SecurityChecker {
    constructor (req, res, next) {
        this.req = req || {}
        this.res = res || {}
        this.next = next || (() => {})
        this.blacklistIPs = []
        this.blacklistUsers = []
        this.user = "unknown"
        this.isAuth = false
        this.isNoAuthAccess = true
        this.whitelistIPs = []
        this.useIpWhitelist = false
    }

    generate () {
        return (req, res, next) => {
            try {
                const IP = req.headers["x-forwarded-for"]
                if (this.blacklistIPs.includes(IP)) {
                    return res.status(403).json({ ok: false, error: "IP address banned" })
                }
                if (this.blacklistUsers.includes(this.user)) {
                    return res.status(403).json({ ok: false, error: "Account banned" })
                }
                if (!this.isAuth) {
                    if (!this.isNoAuthAccess) {
                        return res.status(401).json({ ok: false, error: "No authorized" })
                    }
                }
                if (this.useIpWhitelist) {
                    if (!this.whitelistIPs.includes(IP)) {
                        return res.status(403).json({ ok: false, error: "IP white list is no includes your IP address" })
                    }
                }
                next()
            } catch (error) {
                console.error(error)
                return res.status(500).json({ ok: "Security check falied" })
            }
        }
    }
}

export default SecurityChecker