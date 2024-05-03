const jwt = require("jwt-simple");

module.exports = (app) => {
    const cfg = app.libs.config;
    const Users = app.db.models.Users;

    /**
     * @api {post} /token Generate authentication token
     * @apiGroup Authentication
     * @apiParam {String} email User's email
     * @apiParam {String} password User's password
     * @apiParamExample {json} Input
     *  {
     *      "email": "example@domain.com",
     *      "password": "yourpassword"
     *  }
     * @apiSuccess {String} token JWT token of authenticated user
     * @apiSuccessExample {json} Success
     *  HTTP/1.1 200 OK
     *  {"token": "encoded_jwt_token_here"}
     * @apiErrorExample {json} Authentication error
     *  HTTP/1.1 401 Unauthorized
     */
    app.post("/token", async (req, res) => {
        if (req.body.email && req.body.password) {
            const email = req.body.email;
            const password = req.body.password;

            try {
                const user = await Users.findOne({ where: { email: email } });
                if (user && Users.isPassword(user.password, password)) {
                    const payload = { id: user.id };
                    res.json({ token: jwt.encode(payload, cfg.jwtSecret) });
                } else {
                    res.sendStatus(401);
                }
            } catch (error) {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    });
}

