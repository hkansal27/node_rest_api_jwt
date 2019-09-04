const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRound = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    }
});

// Mongoose provide middleware(pre/post hooks) which we can use to manipulate our data before/after inserting into database
// hash user password before saving to database
UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRound)
})

module.exports = mongoose.model("User", UserSchema)