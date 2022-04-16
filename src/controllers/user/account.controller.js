var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const crypto = require('crypto')
const sendEmail = require('../../util/sendEmail')
const db = require('../../models/index')
const ResetPassword = db.resetPassword
const User = db.user

exports.signup = async (req, res) => {
  try {
    var user
    if (!req.file) {
      user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        userName: req.body.userName,
        email: req.body.email,
        phone: req.body.phone,
        //avatar: req.file.path
      })
    } else {
      user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        userName: req.body.userName,
        email: req.body.email,
        phone: req.body.phone,
        avatar: req.file.path
      })
    }
    user.save((err, user) => {
      if (err) {
        return res.status(500).send({
          errorCode: 500,
          message: err
        })
      }
      return res.status(200).send({
        errorCode: 0,
        message: "User was registered successfully!"
      })
    })
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: 'Sign up account function is error!'
    })
  }
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
    const user = await User.findOne({ username, deleted: false });
    if (!user) {
      return res.status(404).json({
        errorCode: "404",
        message: "User not found!",
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
      var userInfo = {
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
      return res.status(200).json({
        errorCode: 0,
        token: token,
        refreshToken: refreshToken,
        role: 'user',
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
      message: "User server is error",
    })
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const id = req.accountID
    const user = await User.findOne({ _id: id })
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
      await User.findByIdAndUpdate({ _id: id }, { password: bcrypt.hashSync(newPassword, 8) }, { new: true })
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
      message: 'Update password function is error!'
    })
  }
}

exports.editAccount = async (req, res, next) => {
  const id = req.accountID
  User.findById({ _id: id }).then(accInfo => {
    const acc = {
      userName: accInfo.userName,
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
        errorCode: 500,
        message: 'Edit account function is error!'
      })
    })
}

exports.updateAccount = async (req, res, next) => {
  try {
    const id = req.accountID
    const userName = req.body.userName
    const email = req.body.email
    const avatar = req.file.path
    const phone = req.body.phone
    await User.findByIdAndUpdate({ _id: id },
      {
        userName: userName,
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
      message: 'Update account function is error!'
    })
  }
}

exports.sendEmailResetPass = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
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

    const link = `${process.env.BASE_URL}/user/account/update-forgotten-password/${user._id}/${token.token}`
    await sendEmail(user.email, "Password reset", link);

    return res.status(200).send({
      errorCode: 0,
      message: "password reset link sent to your email account"
    })
  } catch (error) {
    return res.status(500).send({
      errorCode: 500,
      message: 'Forgot password function is error!'
    })
  }
}

exports.confirmLink = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findById(req.params.accountID);
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
    return res.status(500).send({
      errorCode: 500,
      message: 'Change password function is error!'
    })
  }
}