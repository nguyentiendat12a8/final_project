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
  const user = new Admin({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    adminName: req.body.adminName,
    email: req.body.email,
    phone: req.body.phone,
    //avatar: req.file.path
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
      message: "Admin was registered successfully!"
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
          expiresIn: process.env.RefreshTokenLife,
        }
      )
      userInfo = {
        adminName: user.adminName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
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
    const user = await Admin.findOne({ _id: id })
    if (!user) return res.status(404).send({
      errorCode: 404,
      message: 'User not found'
    })
    const password = req.body.password
    const newPassword = bcrypt.hashSync(req.body.newPassword, 8)
    if (bcrypt.compareSync(password, user.password)) {
      await Admin.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true })
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

    const user = await Admin.findById(req.params.accountID);
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


// manage account of user
exports.listUserAccount = async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1
  User.find({ deleted: false })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      User.countDocuments({ deleted: false }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: list,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
}

exports.detailUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findOne({ _id: userID }, (err, user) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      data: user
    })
  })
}

exports.deleteUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findByIdAndUpdate({ _id: userID }, { deleted: true }, { new: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      message: `Delete user successfully!`
    })
  })
}

exports.trashUserAccount = async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1
  User.find({ deleted: true })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      User.countDocuments({ deleted: true }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: list,
          current: page,
          pages: Math.ceil(count / perPage)
        })
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
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore user account successfully'
    })
  })
}

exports.forceDeleteUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.deleteOne({ _id: userID, deleted: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'delete function invalid or user server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Force delete user account successfully'
    })
  })
}

// manage account of moderator

exports.listModAccount = async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1
  Moderator.find({ deleted: false })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      Moderator.countDocuments({ deleted: false }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: list,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
}

exports.detailModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  Moderator.findById({ _id: moderatorID }, (err, mod) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
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
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      message: `Delete moderator successfully!`
    })
  })
}

exports.trashModAccount = async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1
  Moderator.find({ deleted: true })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      Moderator.countDocuments({ deleted: true }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: list,
          current: page,
          pages: Math.ceil(count / perPage)
        })
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
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore Moderator account successfully'
    })
  })
}

exports.forceDeleteModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.deleteOne({ _id: moderatorID, deleted: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'delete function invalid or mod server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Force delete moderator account successfully'
    })
  })
}

//manage account of admin
exports.listAdminAccount = async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1
  Admin.find({ deleted: false })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      Admin.countDocuments({ deleted: false }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: list,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
}

exports.detailAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  Admin.findById({ _id: adminID }, (err, admin) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      data: admin
    })
  })
}

exports.deleteAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Admin.findByIdAndUpdate({ _id: adminID }, { deleted: true }, { new: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      message: `Delete Admin successfully!`
    })
  })

}

exports.trashAdminAccount = async (req, res) => {
  let perPage = 10
  let page = req.params.page || 1
  Admin.find({ deleted: true })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      Admin.countDocuments({ deleted: true }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: list,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
}

exports.restoreAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Admin.findByIdAndUpdate({ _id: adminID }, { deleted: false }, { new: true }, (err) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore Admin account successfully'
    })
  })
}

exports.forceDeleteAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Admin.deleteOne({ _id: adminID, deleted: true }, err => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'delete function invalid or mod server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Force delete Admin account successfully'
    })
  })
}
