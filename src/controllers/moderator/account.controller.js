
const db = require('../models/users/index')
const Account = db.account
const Role = db.role
const ROLES = db.ROLES
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
  const user = new Account({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phone: req.body.phone
  })

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: err
      })
    }

    if (req.body.roles) {
      Role.find({
        name: { $in: req.body.roles }
      }, (err, roles) => {
        if (err) {
          return res.status(500).send({
            errorCode: 500,
            message: err
          })
        }
        user.roles = roles.map(role => role._id)
        user.save(err => {
          if (err) {
            return res.status(500).send({
              errorCode: 500,
              message: err
            })
          }
          res.send({
            errorCode: 0,
            message: 'User was registered successfully'
          })
        })
      })
    }
    else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          return res.status(500).send({
            errorCode: 500,
            message: err
          })
        }
        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({
              errorCode: 500,
              message: err
            })
            return
          }
          res.send({
            errorCode: 0,
            message: "User was registered successfully!"
          });
        });
      });
    }
  });
}


exports.signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(500).json({
        errorCode: 500,
        message: "All input is required",
      });
    }
    const user = await Account.findOne({ username: username });
    if (!user) {
      res.status(404).json({
        errorCode: "404",
        message: "User not found ~~~",
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: process.env.tokenLife,
      });
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: process.env.RefreshTokenLife,
        }
      );
      const role = await Role.findById(user.roles).then((response) => {
        console.log("response", response);
        return response.name;
      });
      return res.status(200).json({
        errorCode: 0,
        token: token,
        role: role,
        refreshToken: refreshToken
      });
    } else {
      return res.status(400).json({
        errorCode: 400,
        message: "Invalid Credentials, password",
      })
    }
  } catch (err) {
    return console.log(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //const { id } = req.params
    const id = req.body.id
    const user = await Account.findOne({ _id: id })
    const password = req.body.password
    const newPassword = bcrypt.hashSync(req.body.newPassword, 8)
    if (bcrypt.compareSync(password, user.password)) {
      await Account.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true })
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
  Account.findById({ _id: id }).then(accInfo => {
    const acc = {
      avatar: accInfo.avatar,
      phone: accInfo.phone
    } 
    return res.status(200).send({
      errorCode: 0,
      acc
    })
  })
    .catch(err =>{
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
    console.log(id)
    const avatar = req.file.path
    const phone = req.body.phone
    await Account.findByIdAndUpdate({ _id: id }, { avatar: avatar,phone:phone }, { new: true })
    return res.status(200).send({ message: 'Change info successfully!' })
  } catch (error) {
    console.log(error)
  }
}



exports.deleteAccount = async (req, res, next) => {
  try {
    const id = req.params.id
    Account.deleteOne({_id: id})
    .then(()=>{
      return res.status(200).send({
        errorCode: 0,
        message: 'Delete account successfully!'
      })
    })
  }
  catch(err){
    
  }
}


