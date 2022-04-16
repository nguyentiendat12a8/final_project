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
    const user = new Moderator({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      modName: req.body.modName,
      email: req.body.email,
      phone: req.body.phone,
      //avatar: req.file.path,
      organizationName: req.body.organizationName,
      tourCustomStatus: req.body.tourCustomStatus,
      //dueDate: 
    })
  } else {
    const user = new Moderator({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      modName: req.body.modName,
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.file.path,
      organizationName: req.body.organizationName,
      tourCustomStatus: req.body.tourCustomStatus,
      //dueDate: 
    })
  }
  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: 'Sign up function is error!'
      })
    }
    return res.send({
      errorCode: 0,
      message: "Moderator was registered successfully!"
    })
  })
}

exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).json({
        errorCode: 400,
        message: "All input is required",
      })
    }
    const user = await Moderator.findOne({ username, deleted: false });
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
        modName: user.modName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        organizationName: user.organizationName,
      }
      return res.status(200).json({
        errorCode: 0,
        token: token,
        role: 'moderator',
        refreshToken: refreshToken,
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
      message: 'Sign in function is error!',
    })
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const id = req.accountID
    const user = await Moderator.findOne({ _id: id })
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
      await Moderator.findByIdAndUpdate({ _id: id }, { password: bcrypt.hashSync(newPassword, 8) }, { new: true })
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
    return res.status(500).json({
      errorCode: 500,
      message: 'Update password function is error!',
    })
  }
}

exports.editAccount = async (req, res, next) => {
  const id = req.accountID
  Moderator.findById(id).then(accInfo => {
    const acc = {
      adminName: accInfo.adminName,
      email: accInfo.email,
      phone: accInfo.phone,
      avatar: accInfo.avatar,
      organizationName: accInfo.organizationName,
      tourCustomStatus: accInfo.tourCustomStatus
    }
    return res.status(200).send({
      errorCode: 0,
      data: acc
    })
  })
    .catch(err => {
      return res.status(500).send({
        errorCode: 500,
        message: 'Edit account function is error!'
      })
    })
}

exports.updateAccount = async (req, res, next) => {
  try {
    const id = req.accountID
    const modName = req.body.modName
    const email = req.body.email
    const avatar = req.file.path
    const phone = req.body.phone
    const organizationName = req.body.organizationName
    const tourCustomStatus = req.body.tourCustomStatus
    await Moderator.findByIdAndUpdate({ _id: id },
      {
        modName,
        email,
        avatar,
        phone,
        organizationName,
        tourCustomStatus
      },
      { new: true })
    return res.status(200).send({ message: 'Change info successfully!' })
  } catch (error) {
    return res.status(500).json({
      errorCode: 500,
      message: 'Update account function is error!',
    })
  }
}

exports.sendEmailResetPass = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Moderator.findOne({ email: req.body.email })
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

    const link = `${process.env.BASE_URL}/moderator/account/update-forgotten-password/${user._id}/${token.token}`
    await sendEmail(user.email, "Password reset", link);

    return res.status(200).send({
      errorCode: 0,
      message: "password reset link sent to your email account"
    })
  } catch (error) {
    return res.status(500).json({
      errorCode: 500,
      message: 'Forgot password function is error!',
    })
  }
}


exports.confirmLink = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Moderator.findById(req.params.accountID);
    if (!user) return res.status(400).send({
      errorCode: 400,
      message: "invalid link or expired 1"
    })

    const token = await ResetPassword.findOne({
      accountID: user._id,
      token: req.params.token,
    })
    if (!token) return res.status(400).send("Invalid link or expired 2")

    user.password = bcrypt.hashSync(req.body.password, 8)
    await user.save()
    await token.delete()
    return res.status(200).send({
      errorCode: 0,
      message: "password reset sucessfully."
    })
  } catch (error) {
    return res.status(500).json({
      errorCode: 500,
      message: 'Change password function is error!',
    })
  }
}



// payment method
exports.configPaypal = async (req, res) => {
  const check = await PaypalInfo.findOne({ moderatorID: req.accountID })
  if (check) return res.status(400).send({
    errorCode: 400,
    message: 'Only 1 payment account per person!'
  })
  const paypalInfo = new PaypalInfo({
    clientID: req.body.clientID,
    secret: req.body.secret,
    moderatorID: req.accountID
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
  PaypalInfo.findOne({ moderatorID: req.accountID }, (err, paypal) => {
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
  PaypalInfo.findOne({ moderatorID: req.accountID }, (err, paypal) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Edit paypal function is error!'
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
  PaypalInfo.findOneAndUpdate({ moderatorID: req.accountID }, {
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