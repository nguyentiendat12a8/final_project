var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const crypto = require('crypto')
const sendEmail = require('../../util/sendEmail')
const db = require('../../models/index')
const Admin = db.admin
const ResetPassword = db.resetPassword
const User = db.user
const Moderator = db.moderator
const PaypalInfo = db.paypalInfo

exports.signup = async (req, res) => {
  var user
  if(!req.file) {
   user = new Admin({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      adminName: req.body.adminName,
      email: req.body.email,
      phone: req.body.phone,
      //avatar: req.file.path
    })
  } else {
    user = new Admin({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      adminName: req.body.adminName,
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.file.path
    })
  }
  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: 'Signup function is error!'
      })
    }
    return res.send({
      errorCode: 0,
      message: "Admin was registered successfully!"
    })
  })
}

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({
        errorCode: 400,
        message: "All input is required",
      })
    }
    const user = await Admin.findOne({ username });
    if (!user) {
      return res.status(404).json({
        errorCode: "404",
        message: "User not found ~~~",
      })
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: process.env.tokenLife,
      })
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: process.env.refreshTokenLife,
        }
      )
      userInfo = {
        adminName: user.adminName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
      return res.status(200).send({
        errorCode: 0,
        token: token,
        refreshToken: refreshToken,
        role: 'admin',
        data: userInfo
      })
    } else {
      return res.status(400).json({
        errorCode: 400,
        message: "Invalid password",
      })
    }
  } catch (err) {
    return res.status(500).json({
      errorCode: 500,
      message: "Admin server is error",
    })
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const id = req.accountID
    const user = await Admin.findOne({ _id: id })
    if (!user) return res.status(404).send({
      errorCode: 404,
      message: 'User not found'
    })
    const password = req.body.password
    const newPassword = req.body.newPassword
    const newPasswordAgain = req.body.newPasswordAgain
    if (newPassword !== newPasswordAgain) {
      return res.status(400).send({
        errorCode: 400,
        message: 'New password invalid!'
      })
    }
    if (bcrypt.compareSync(password, user.password)) {
      await Admin.findByIdAndUpdate({ _id: id }, { password: bcrypt.hashSync(newPassword, 8) }, { new: true })
      return res.status(200).send({
        errorCode: 0,
        message: 'Change password successfully!'
      })
    }
    else {
      return res.status(400).send({
        errorCode: 400,
        message: 'Wrong password!'
      })
    }
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: 'Change password is error!'
    })
  }
}

exports.editAccount = async (req, res, next) => {
  const id = req.accountID
  Admin.findById({ _id: id }).then(accInfo => {
    const acc = {
      adminName: accInfo.adminName,
      email: accInfo.email,
      phone: accInfo.phone,
      avatar: accInfo.avatar,
    }
    return res.status(200).send({
      errorCode: 0,
      data: acc
    })
  })
    .catch(err => {
      return res.status(500).send({
        errorCode: '500',
        message: err
      })
    })
}

exports.updateAccount = async (req, res, next) => {
  try {
    const id = req.accountID
    const adminName = req.body.adminName
    const email = req.body.email
    const avatar = req.file.path
    const phone = req.body.phone
    await Admin.findByIdAndUpdate({ _id: id },
      {
        adminName: adminName,
        email: email,
        avatar: avatar,
        phone: phone
      },
      { new: true })
    return res.status(200).send({ 
      errorCode: 0,
      message: 'Change info successfully!' 
    })
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: 'Change info is error!'
    })
  }
}

exports.sendEmailResetPass = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Admin.findOne({ email: req.body.email })
    if (!user)
      return res.status(400).send({
        errorCode: 400,
        message: "user with given email doesn't exist"
      })

    let token = await ResetPassword.findOne({ accountID: user._id })
    if (!token) {
      token = await new ResetPassword({
        accountID: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save()
    }

    const link = `${process.env.BASE_URL}/admin/account/update-forgotten-password/${user._id}/${token.token}`
    await sendEmail(user.email, "Password reset", link);

    return res.status(200).send({
      errorCode: 0,
      message: "password reset link sent to your email account"
    })
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: "Forgot password function is error!"
    })
  }
}

exports.confirmLink = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.details[0].message
    })

    const user = await Admin.findById(req.params.accountID);
    if (!user) return res.status(400).send({
      errorCode: 400,
      message: "invalid link or expired"
    })

    const token = await ResetPassword.findOne({
      accountID: user._id,
      token: req.params.token,
    })
    if (!token) return res.status(400).send({
      errorCode: 400,
      message: "Invalid link or expired"
    })

    user.password = bcrypt.hashSync(req.body.password, 8)
    await user.save()
    await token.delete()
    return res.status(200).send({
      errorCode: 0,
      message: "password reset sucessfully."
    })
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: 'Change password is error!'
    })
  }
}

// manage account of user
exports.listUserAccount = async (req, res) => {
  User.find({ deleted: false }, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    var show = []
    list.forEach(e => {
      var detail = {
        _id: e._id,
        username: e.username,
        userName: e.userName,
        email: e.email,
        phone: e.phone,
        avatar: e.avatar
      }
      show.push(detail)
    })
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

// exports.detailUserAccount = async (req, res) => {
//   const userID = req.params.userID
//   if (!userID) return res.status(400).send({
//     errorCode: 400,
//     message: 'Invalid link'
//   })
//   User.findOne({ _id: userID }, (err, user) => {
//     if (err) return res.status(500).send({
//       errorCode: 500,
//       message: err
//     })
//     return res.status(200).send({
//       errorCode: 0,
//       data: user
//     })
//   })
// }

exports.deleteUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findByIdAndUpdate({ _id: userID }, { deleted: true }, { new: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    return res.status(200).send({
      errorCode: 0,
      message: `Delete user successfully!`
    })
  })
}

exports.trashUserAccount = async (req, res) => {
  User.find({ deleted: true }, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    var show = []
    list.forEach(e => {
      var detail = {
        _id: e._id,
        username: e.username,
        userName: e.userName,
        email: e.email,
        phone: e.phone,
        avatar: e.avatar
      }
      show.push(detail)
    })
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

exports.restoreUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findByIdAndUpdate({ _id: userID }, { deleted: false }, { new: true }, (err) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore user account successfully'
    })
  })
}

// manage account of moderator

exports.listModAccount = async (req, res) => {
  Moderator.find({ deleted: false }, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    var show = []
    list.forEach(e => {
      var detail = {
        _id: e._id,
        username: e.username,
        modName: e.modName,
        email: e.email,
        phone: e.phone,
        avatar: e.avatar,
        organizationName: e.organizationName,
        tourCustomStatus: e.tourCustomStatus
      }
      show.push(detail)
    })
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

exports.detailModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  await Moderator.findById({ _id: moderatorID }, (err, mod) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator server is error!'
    })
    return res.status(200).send({
      errorCode: 0,
      data: mod
    })
  })
}

exports.deleteModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.findByIdAndUpdate({ _id: moderatorID }, { deleted: true }, { new: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    return res.status(200).send({
      errorCode: 0,
      message: `Delete moderator successfully!`
    })
  })
}

exports.trashModAccount = async (req, res) => {
  Moderator.find({ deleted: true }, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    var show = []
    list.forEach(e => {
      var detail = {
        _id: e._id,
        username: e.username,
        modName: e.modName,
        email: e.email,
        phone: e.phone,
        avatar: e.avatar,
        organizationName: e.organizationName,
        tourCustomStatus: e.tourCustomStatus
      }
      show.push(detail)
    })
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

exports.restoreModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.findByIdAndUpdate({ _id: moderatorID }, { deleted: false }, { new: true }, (err) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore Moderator account successfully'
    })
  })
}

// payment method
exports.configPaypal = async (req, res) => {
  const check = await PaypalInfo.findOne({ adminID: req.accountID })
  if (check) return res.status(400).send({
    errorCode: 400,
    message: 'Only 1 payment account per person!'
  })
  const paypalInfo = new PaypalInfo({
    clientID: req.body.clientID,
    secret: req.body.secret,
    adminID: req.accountID
  })
  await paypalInfo.save(err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Save paypal function is error!'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Config paypal successfully'
    })
  })
}

exports.viewPaypal = async (req, res) => {
  PaypalInfo.findOne({ adminID: req.accountID }, (err, paypal) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Paypal server is error!'
    })
    if (!paypal) return res.status(200).send({
      errorCode: 0,
      message: 'The account does not have paypal payment information!'
    })
    var show = {
      clientID: paypal.clientID,
      secret: paypal.secret
    }
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

exports.editPaypal = async (req, res) => {
  PaypalInfo.findOne({ adminID: req.accountID }, (err, paypal) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Paypal server is error!'
    })
    if (!paypal) return res.status(400).send({
      errorCode: 400,
      message: 'The account does not have paypal payment information!'
    })
    var show = {
      clientID: paypal.clientID,
      secret: paypal.secret
    }
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

exports.updatePaypal = async (req, res) => {
  PaypalInfo.findOneAndUpdate({ adminID: req.accountID }, {
    clientID: req.body.clientID,
    secret: req.body.secret
  }, { new: true }, (err) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err.message
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Update paypal information successfully!'
    })
  })
}
