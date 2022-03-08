var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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
    avatar: req.file.path
  })
  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: err
      })
    }
    res.send({
      errorCode: 0,
      message: "Admin was registered successfully!"
    })
  })
}

exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).json({
        errorCode: 400,
        message: "All input is required",
      })
    }
    const user = await Admin.findOne({ username });
    if (!user) {
      res.status(404).json({
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
    //const { id } = req.params
    const id = req.body.id //req.userId
    const user = await Admin.findOne({ _id: id })
    if(!user) return res.status(404).send({
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
  const id = req.userId
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
    //const { id } = req.params
    const id = req.body.id //req.userId
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

    const link = `${process.env.BASE_URL}/admin/confirmLink/${user._id}/${token.token}`
    await sendEmail(user.accountEmail, "Password reset", link);

    res.send("password reset link sent to your email account")
  } catch (error) {
    res.send("An error occured")
    console.log(error)
  }
}


exports.confirmLink = async (req, res) => {
  try {
    const schema = Joi.object({ accountPassword: Joi.string().required() })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const user = await Account.findById(req.params.accountID);
    if (!user) return res.status(400).send({
      errorCode: 400,
      message: "invalid link or expired"
    })

    const token = await ResetPassword.findOne({
      accountID: user._id,
      token: req.params.token,
    })
    if (!token) return res.status(400).send("Invalid link or expired")

    user.accountPassword = bcrypt.hashSync(req.body.accountPassword, 8)
    await user.save()
    await token.delete()
    res.send("password reset sucessfully.")
  } catch (error) {
    res.send("An error occured")
    console.log(error);
  }
}



// exports.deleteAccount = async (req, res, next) => {
//   try {
//     const id = req.params.id
//     Admin.deleteOne({ _id: id })
//       .then(() => {
//         return res.status(200).send({
//           errorCode: 0,
//           message: 'Delete account successfully!'
//         })
//       })
//   }
//   catch (err) {

//   }
// }


// manage account of user
exports.listUserAccount = async (req, res) => {
  User.find({}, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: list
    })
  })
}

exports.detailUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findById({ _id: userID }, (err, user) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: user
    })
  })
}

exports.editUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findById({_id: userID}, (err, user) =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: user
    })
  })
}

exports.updateUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findByIdAndUpdate({_id: userID}, {
    password:  bcrypt.hashSync(req.body.password, 8),
    userName: req.body.userName,
    email: req.body.email,
    phone: req.body.phone,
    avatar: req.file.avatar
  }, {new: true}, err =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'update user data is successfully!'
    })
  })
}

exports.deleteUserAccount = async (req, res) => {
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  const user = await User.findById({_id: userID})
  if(!user) return res.status(400).send({
    errorCode: 400,
    message: 'user not found!'
  })
  await user.delete()
  return res.status(200).send({
    errorCode: 0,
    message: `Delete user successfully!`
  })
}

exports.trashUserAccount = async(req,res) =>{
  User.findDeleted({}, (err, listDelete) =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: listDelete
    })
  })
}

exports.restoreUserAccount = async (req,res)=>{
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.restore({_id: userID}, (err)=>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore user account successfully'
    })
  })
}

exports.forceDeleteUserAccount = async (req,res)=>{
  const userID = req.params.userID
  if (!userID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.deleteOne({_id: userID}, err =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'User account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Force delete user account successfully'
    })
  })
}

// manage account of moderator

exports.listModAccount = async (req, res) => {
  Moderator.find({}, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: list
    })
  })
}

exports.detailModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  Moderator.findById({ _id: moderatorID }, (err, mod) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: mod
    })
  })
}

exports.editModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.findById({_id: moderatorID}, (err, mod) =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Mod account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: mod
    })
  })
}

exports.updateModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.findByIdAndUpdate({_id: moderatorID}, {
    password:  bcrypt.hashSync(req.body.password, 8),
    modName: req.body.modName,
    email: req.body.email,
    phone: req.body.phone,
    avatar: req.file.avatar,
    organizationName: req.body.organizationName,
    dueDate: req.body.dueDate
  }, {new: true}, err =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Update moderator data is successfully!'
    })
  })
}

exports.deleteModAccount = async (req, res) => {
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  const mod = await Moderator.findById({_id: moderatorID})
  if(!mod) return res.status(400).send({
    errorCode: 400,
    message: 'moderator not found!'
  })
  await mod.delete()
  return res.status(200).send({
    errorCode: 0,
    message: `Delete moderator successfully!`
  })
}

exports.trashModAccount = async(req,res) =>{
  Moderator.findDeleted({}, (err, listDelete) =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: listDelete
    })
  })
}

exports.restoreModAccount = async (req,res)=>{
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.restore({_id: moderatorID}, (err)=>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore Moderator account successfully'
    })
  })
}

exports.forceDeleteModAccount = async (req,res)=>{
  const moderatorID = req.params.moderatorID
  if (!moderatorID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Moderator.deleteOne({_id: moderatorID}, err =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Moderator account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Force delete moderator account successfully'
    })
  })
}

//manage account of admin
exports.listAdminAccount = async (req, res) => {
  User.find({}, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: list
    })
  })
}

exports.detailAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  Admin.findById({ _id: adminID }, (err, admin) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: 'Admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: admin
    })
  })
}

exports.editAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Admin.findById({_id: adminID}, (err, admin) =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: admin
    })
  })
}

exports.updateAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  User.findByIdAndUpdate({_id: adminID}, {
    password:  bcrypt.hashSync(req.body.password, 8),
    adminName: req.body.adminName,
    email: req.body.email,
    phone: req.body.phone,
    avatar: req.file.avatar
  }, {new: true}, err =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'update admin data is successfully!'
    })
  })
}

exports.deleteAdminAccount = async (req, res) => {
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  const admin = await Admin.findById({_id: adminID})
  if(!admin) return res.status(400).send({
    errorCode: 400,
    message: 'Admin not found!'
  })
  await admin.delete()
  return res.status(200).send({
    errorCode: 0,
    message: `Delete Admin successfully!`
  })
}

exports.trashAdminAccount = async(req,res) =>{
  Admin.findDeleted({}, (err, listDelete) =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      data: listDelete
    })
  })
}

exports.restoreAdminAccount = async (req,res)=>{
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Admin.restore({_id: adminID}, (err)=>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore Admin account successfully'
    })
  })
}

exports.forceDeleteAdminAccount = async (req,res)=>{
  const adminID = req.params.adminID
  if (!adminID) return res.status(400).send({
    errorCode: 400,
    message: 'Invalid link'
  })
  Admin.deleteOne({_id: adminID}, err =>{
    if(err) return res.status(500).send({
      errorCode: 500,
      message: 'Admin account server is error'
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Force delete Admin account successfully'
    })
  })
}





//search acccountt
// app.get('/users/search', (req,res) => {
// 	var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên

// 	var result = users.filter( (user) => {
// 		// tìm kiếm chuỗi name_search trong user name. 
// 		// Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
// 		return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
// 	})

// 	res.render('users/index', {
// 		users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
// 	});
// })