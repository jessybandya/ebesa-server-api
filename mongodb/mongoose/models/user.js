const Mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const {
  Schema
} = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: () => {
      return this.provider !== 'email' ? false: true;
    }
  },
  phoneNumber: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  password: {
    type: String
  },
  merchant: {
    type: Schema.Types.ObjectId,
    ref: 'Merchant',
    default: null
    },
    provider: {
      type: String,
      required: true,
    default: 'email'
    },
    googleId: {
      type: String
    },
    facebookId: {
      type: String
    },
    avatar: {
      type: String
    },
    role: {
      type: String,
    default: 'ROLE_MEMBER',
      enum: ['ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_MERCHANT']
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    updated: Date,
    created: {
      type: Date,
    default: Date.now
    }
  });

  //Generating a hash
  UserSchema.pre(
    'save', function() {
      try {
       let user = this;
        this.password = bcryptjs.hashSync(this.password, bcryptjs.genSaltSync(10))
      } catch(err) {
        console.log("Hashing error caught! "+ err)}});

  UserSchema.methods = {
    hash(password) {
      try {
        return bcryptjs.hashSync(password,
          bcrypt.genSaltSync(10));
      } catch(err) {
        console.log('Hash generation failed. Error:' + err)}
    },
  }

  UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcryptjs.compareSync(password,
      this.password)
    return compare
  }

  //Creating User Model
  const UserModel = Mongoose.model('User',
    UserSchema);

  module.exports = UserModel;