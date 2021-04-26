import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Role from '../models/role.model';

/*
@fvillarrealcespedes:
Exports seven methods for user CRUD operations and Login.
*/ 
export default{
    /*
    @fvillarrealcespedes:
    POST a new user given a NEURONE-Auth request body.
    */     
    async createUserNEURONEAuth(req, res){
        const user = new User(
            req.body            
        );
        await user.save((err, user) => {
            if(err){
                return res.status(500).send(
                    err
                );
            }
            res.status(200).json({
                message: 'User successfully created!', user
            });
        });
    },

    /*
    @fvillarrealcespedes:
    POST a new user given a NEURONE-AD request body.
    */ 
    async createUser(req, res){
        const user = new User(
            req.body
        );
        await user.save((err, user) => {
            if(err){
                return res.status(500).send(
                    err
                );
            }
            if(req.body.roles){
                Role.find({ name: {$in: req.body.roles }}), function(err, roles){
                    if(err){
                        return res.status(500).send(
                            err
                        );
                    }
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if(err){
                            return res.status(500).send(
                                err
                            );
                        }
                        res.status(200).json({
                            message: 'User successfully created!', user
                        });
                    });
                }
            } else{
                Role.find({ name: 'user' }, function(err, role){
                    if(err){
                        return res.status(500).send(
                            err
                        );
                    }
                    user.roles = [role._id];
                    user.save(err => {
                        if(err){
                            return res.status(500).send(
                                err
                            );
                        }
                        res.status(200).json({
                            message: 'User successfully created!', user
                        });
                    });
                })
            }
        });
    },

    /*
    @fvillarrealcespedes:
    GET all users.
    */       
    async readUsers(req, res){
        await User.find((err, users) => {
            if(err){
                return res.status(500).send(
                    err
                );
            }
            res.status(200).json({
                users
            });
        });
    },


    /*
    @fvillarrealcespedes:
    UPDATE a user given the id and a request body.
    */    
    async updateUser(req, res){
        const id = req.params.id;
        await User.findByIdAndUpdate({_id: id}, req.body, {new: true}, (err, user) => {
            if(err){
                return res.status(404).send(
                    err
                );
            }
            res.status(200).json({
                message: 'User successfully updated!', user
            });
        });
    },    

    /*
    @fvillarrealcespedes:
    DELETE a user given the id.
    */    
    async deleteUser(req, res){
        const id = req.params.id;
        await User.findByIdAndDelete({_id: id}, (err, user) => {
            if(err){
                return res.status(500).send(
                    err
                );
            }
            res.status(200).json({
                message: 'User successfully deleted!', user
            });
        });
    },

    /*
    @fvillarrealcespedes:
    DELETE a user given the id.
    */        
    async readOneUser(req, res){
        const id = req.params.id;
        await User.findOne({_id: id}, (err, user) => {
            if(err){
                return res.status(500).send(
                    err
                );
            }
            res.status(200).json({
                user
            });
        })
    },

    /*
    @fvillarrealcespedes:
    Allows or denies user access given a request body that includes a JWT.
    */
    async login(req, res){
        await User.findOne({ username: req.body.username })
            .populate('roles', '-__v')
            .exec((err, user) => {
                if(err){
                    return res.status(500).send(
                        err
                    );
                }
                if(!user){
                    return res.status(404).send({
                        message: 'USER_NOT_FOUND'
                    });                
                }
                user.populate('roles', '-__v');
                var passwordIsValid = bcryptjs.compareSync(
                    req.body.password,
                    user.password
                );
                if(!passwordIsValid){
                    return res.status(401).send({
                        accessToken: null,
                        message: 'WRONG_PASSWORD'
                    });                  
                }
                var token = jwt.sign({ id: user.id}, process.env.SECRET_KEY, {
                    expiresIn: 86400 /*24 Hours*/ 
                });
                var authorities = [];
                for(let i = 0; i < user.roles.length; i++){
                    authorities.push('ROLE' + user.roles[i].name.toUpperCase());
                }
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
    }
}
