const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'LEAGUE_ROLE', 'TEAM_ROLE', 'PLAYER_ROLE', 'REFEREE_ROLE'],
    message: '{VALUE} isn\'t valid role.'
}
let Schema = mongoose.Schema;
let userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    nickname: {
        type: String,
        required: [true, 'Nickname is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        default: 'PLAYER_ROLE',
        enum: validRoles
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required']
    },
    telephone: {
        type: String,
        required: false
    },
    sex: {
        type: String,
        required: false
    },
    documentID: {
        type: Number,
        required: [true, 'ID is required']
    }
})

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('User', userSchema);