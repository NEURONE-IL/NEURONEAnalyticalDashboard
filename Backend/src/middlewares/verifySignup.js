import User from '../models/user.model';
import Role from '../models/role.model';

/*
@fvillarrealcespedes:
Exports one method for Signup validation.
*/ 
export default{
    /*
    @fvillarrealcespedes:
    Verifies if username or email from a requests is already in use.
    */   
    checkDuplicateUsernameOrEmail(req, res, next){
        /*Verifies if username is already in use*/
        User.findOne({ username: req.body.username }, function(err, user){
            if(err){
                return res.status(500).send(
                    err 
                );
            }
            if(user){
                return res.status(400).send({ 
                    message: 'USERNAME_ALREADY_IN_USE' 
                });
            }
        });
        /*Verifies if email is already in use*/
        User.findOne({ email: req.body.email }, function(err, user){
            if(err){
                return res.status(500).send(
                    err
                );
            }
            if(user){
                return res.status(400).send({ 
                    message: 'EMAIL_ALREADY_IN_USE' 
                });
            }
            next();
        });
    },

    checkRolesExists(req, res, next){
        const allRoles = Role.find({});
        if(req.body.roles){
            for(let i = 0; i < req.body.roles.length; i++){
                if(!allRoles.includes(req.body.roles[i])){
                    res.status(400).send({
                        message: 'ROLE_DOESNT_EXIST'
                    });
                    return;
                }
            }
        }
        next();
    }
}