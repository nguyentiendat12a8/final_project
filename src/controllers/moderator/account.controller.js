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

exports.signup = async (req, res) => {
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
  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: err
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
    const user = await Moderator.findOne({ username });
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
          expiresIn: process.env.RefreshTokenLife,
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
    return console.log(err)
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
    const newPassword = bcrypt.hashSync(req.body.newPassword, 8)
    if (bcrypt.compareSync(password, user.password)) {
      await Moderator.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true })
      return res.status(200).send({ message: 'Change password successfully!' })
    }
    else {
      return res.status(400).send({
        errorCode: 400,
        message: 'Wrong password!'
      })
    }
  } catch (error) {
    console.log(error)
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
        errorCode: '500',
        message: err
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
    console.log(error)
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

    res.send("password reset link sent to your email account")
  } catch (error) {
    res.send("An error occured")
    console.log(error)
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
      message: "invalid link or expired"
    })

    const token = await ResetPassword.findOne({
      accountID: user._id,
      token: req.params.token,
    })
    if (!token) return res.status(400).send("Invalid link or expired")

    user.password = bcrypt.hashSync(req.body.password, 8)
    await user.save()
    await token.delete()
    res.send("password reset sucessfully.")
  } catch (error) {
    res.send("An error occured")
    console.log(error);
  }
}