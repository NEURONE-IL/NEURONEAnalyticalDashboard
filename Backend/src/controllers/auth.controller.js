import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Role from '../models/role.model';

/*
@fvillarrealcespedes:
Exports three methods for user Sign up and Log in operations.
*/ 
export default{
    /*
    @fvillarrealcespedes:
    POST a new user given a NEURONE-Auth request body.
    */     
    async signUpNEURONEAuth(req, res){
        const user = new User(
            req.body            
        );
        await user.save((err, user) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'createError'
                });
            }
            res.status(200).json({
                message: 'User successfully created!', 
                code: 'createSuccess',
                user
            });
        });
    },

    /*
    @fvillarrealcespedes:
    POST a new user given a NEURONE-AD request body.
    */ 
    async signUpNEURONEAD(req, res){
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 8)
        });
        await user.save((err, user) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'createError'
                });
            }
            /*Verifies if request body contains the 'roles' property to assign them*/
            if(req.body.roles){
                Role.find({ name: { $in: req.body.roles }}).exec((err, roles) => {
                    if(err){
                        return res.status(500).send({
                            err,
                            code: 'createError'
                        });
                    }
                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if(err){
                            return res.status(500).send({
                                err,
                                code: 'createError'
                            });
                        }
                        res.status(200).json({
                            message: 'User successfully created!', 
                            code: 'createSuccess',                            
                            user
                        });
                    });
                });
            } 
            /*If request body doesn't contain the 'roles' property, assigns by the default the 'user' role*/
            else{
                Role.findOne({ name: 'user' }).exec((err, role) => {
                    if(err){
                        return res.status(500).send({
                            err,
                            code: 'createError'
                        });
                    }
                    user.roles = [role._id];
                    user.save(err => {
                        if(err){
                            return res.status(500).send({
                                err,
                                code: 'createError'
                            });
                        }
                        res.status(200).json({
                            message: 'User successfully created!', 
                            code: 'createSuccess',
                            user
                        });
                    });
                });
            }
        });
    },

    /*
    @fvillarrealcespedes:
    Allows or denies user access given a request body that includes a username and a password.
    */
    async logIn(req, res){
        await User.findOne({ username: req.body.username })
            .populate('roles', '-__v')
            .exec((err, user) => {
                if(err){
                    return res.status(500).send({
                        err,
                        code: 'unexpectedError'
                    });
                }
                /*If no user is found, returns a error with that message*/
                if(!user){
                    return res.status(404).send({
                        message: 'User not found!',
                        code: 'userNotFound'
                    });                
                }
                user.populate('roles', '-__v');
                /*If user exists, compares its password with the request body password*/
                var passwordIsValid = bcryptjs.compareSync(
                    req.body.password,
                    user.password
                );
                /*If passwords don't match, returns a error with a message of wrong password*/
                if(!passwordIsValid){
                    return res.status(401).send({
                        accessToken: null,
                        message: 'Wrong password!',
                        code: 'wrongPassword'
                    });                  
                }
                /*If passwords match, creates a JWT with 24 hours duration and puts the user data on it*/
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