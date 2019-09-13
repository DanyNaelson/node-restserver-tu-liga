const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'LEAGUE_ROLE', 'TEAM_ROLE', 'PLAYER_ROLE', 'REFEREE_ROLE'],
    message: '{VALUE} isn\'t valid role.'
}
let validSex = {
    values: ['MALE', 'FEMALE'],
    message: '{VALUE} isn\'t valid sex.'
}
let Schema = mongoose.Schema;
let userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'first_name_required']
    },
    lastName: {
        type: String,
        required: [true, 'last_name_required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email_required']
    },
    role: {
        type: String,
        required: [true, 'role_required'],
        default: 'PLAYER_ROLE',
        enum: validRoles
    },
    nickname: {
        type: String,
        required: [true, 'nickname_required']
    },
    password: {
        type: String,
        required: [true, 'password_required']
    },
    confirm: {
        type: Boolean,
        required: false,
        default: false
    },
    birthday: {
        type: Date,
        required: false
    },
    telephone: {
        type: String,
        required: false
        //TO DO: min length 10
    },
    sex: {
        type: String,
        required: false,
        enum: validSex
    },
    documentID: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: [true, 'url_required']
    },
    accountStatus: {
        type: Boolean,
        required: [true, 'account_status_required']
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    },
    facebook: {
        type: Boolean,
        required: false,
        default: false
    },
    withEmail: {
        type: Boolean,
        required: false,
        default: false
    },
    photo: {
        type: String,
        required: false,
        default: 'url_photo'
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