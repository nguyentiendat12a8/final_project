
const db = require('../models/users/index')
const Account = db.account
const Role = db.role
const ROLES = db.ROLES
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
  
}


exports.signin = async (req, res, next) => {
  
}

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


