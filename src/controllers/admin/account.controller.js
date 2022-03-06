
const db = require('../../models/index')
const Admin = db.admin
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
      res.status(500).json({
        errorCode: 500,
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

exports.forgotPassword = (req,res) =>{

}

exports.linkChangePassword = (req,res) =>{

}

exports.updatePassword = async (req, res, next) => {
  try {
    //const { id } = req.params
    const id = req.body.id
    const user = await Admin.findOne({ _id: id })
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
    const id = req.body.id
    //console.log(id)
    const adminName = req.body.adminName
    const email = req.body.email
    const avatar = req.file.path
    const phone = req.body.phone
    await Admin.findByIdAndUpdate({ _id: id },
      { 
        adminName : adminName,
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
exports.listUserAccount = async (req,res) =>{

}

exports.detailUserAccount = async (req,res) =>{

}

exports.editUserAccount = async (req,res) =>{

}

exports.updateUserAccount = async (req,res) =>{

}

exports.deleteUserAccount = async (req,res) =>{

}

// manage account of moderator

exports.listModAccount = async (req,res) =>{

}

exports.detailModAccount = async (req,res) =>{

}

exports.editModAccount = async (req,res) =>{

}

exports.updateModAccount = async (req,res) =>{

}

exports.deleteModAccount = async (req,res) =>{

}

//manage account of admin
exports.listAdminAccount = async (req,res) =>{
try{
  Admin.find({})
  .then(list =>{
    return res.status(200).send({
      errorCode: 0,
      message: list
    })
  })
}
catch (err){

}
}

exports.detailAdminAccount = async (req,res) =>{

}

exports.editAdminAccount = async (req,res) =>{

}

exports.updateAdminAccount = async (req,res) =>{

}

exports.deleteAdminAccount = async (req,res) =>{

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