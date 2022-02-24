const {
    Schema,
    model
} = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 6
    },
    email: {
        type: String,
        unique: true,
        required: 'Please enter an email.',
    },
    validate: {
        validator: function(v) {
          return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`,
      },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// create User model using UserSchema
const User = model('User', UserSchema);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// export the User model
module.exports = User; 