//const { Account, Role } = require("../Databases/Users/account");
const db = require('../Databases/Users/index')
const Account = db.account
const Role = db.role
const bcrypt = require('bcryptjs')

exports.add = async (req,res)=>{
    const user = new Account({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
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