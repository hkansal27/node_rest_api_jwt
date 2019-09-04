const userModel = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    create: (req, res, next) => {
        userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, (err, result) => {
            if (err) {
                return next(err)
            } else {
                console.log(result)
                res.json({ "message": "User created succesfully!", data: null })
            }
        })
    },

    authenticate: (req, res, next) => {
        userModel.findOne({ email: req.body.email }, (err, result) => {
            if (err)
                next(err)
            else {
                if (bcrypt.compareSync(req.body.password, result.password)) {
                    const token = jwt.sign({ id: result._id }, req.app.get('secretKey'), { expiresIn: "1h" });
                    res.json({
                        data: {
                            user: result,
                            token
                        }
                    })
                } else {
                    res.json({ message: 'Invalid Email/password ' })
                }
            }
        })
    }
}