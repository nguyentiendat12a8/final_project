
const db = require('../models/users/index')
const Account = db.account
const Role = db.role
const ROLES = db.ROLES
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = async (req,res)=>{
    const user = new Account({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })

    user.save((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        if(req.body.roles){
        Role.find({
            name: { $in: req.body.roles }
        }, (err, roles) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            user.roles = roles.map(role => role._id)
            user.save(err => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                res.send({ message: 'User was registered successfully' })
            })
        })
        } 
            else {
                Role.findOne({name: 'user'},(err,role)=>{
                    if(err){

                        return res.status(500).send({message: err})
                    }
                    user.roles = [role._id];
                    user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ message: "User was registered successfully!" });
                    });
          });
        }
    });
}

exports.signin = async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            res.status(400).send({
                error: true,
                message: 'All input is required'
            })
        }
        const user = await Account.findOne({ username: username })
        if (!user) {
            res.status(404).send({ error: true, message: 'User not found!' })
        }

        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
                expiresIn: process.env.tokenLife
            })
            const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN_KEY,{
                expiresIn: process.env.RefreshTokenLife
            })
            const userRole = await Role.findById(user.roles).then(response =>{
                return response.name 
            })
            return res.status(200).send({
                token,
                refreshToken,
                user: userRole
            })
        } else {
            return res.status(400).send({ message: 'Invalid Credentials, password' })
        }
    } catch (err) {
        return console.log(err)
    }
}

exports.updatePassword = async (req,res, next) =>{
    try {
        const { id } = req.params
        const user = await Account.findOne({ _id: id })
        const password = req.body.password
        const newPassword = bcrypt.hashSync(req.body.newPassword, 8)
        if (bcrypt.compareSync(password, user.password)){
            await Account.findByIdAndUpdate({_id: id},{password: newPassword}, {new : true})
            return res.status(200).send({message: 'Change password successfully!'})
        }
        else{
            return res.status(400).send({message : 'Wrong password!'})
        }
    } catch (error) {
        console.log(error)
    }
}   


