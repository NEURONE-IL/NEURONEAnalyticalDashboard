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
                    message: 'Username already in use!', 
                    code: 'usernameAlreadyInUse' 
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
                    message: 'Email already in use!', 
                    code: 'emailAlreadyInUse' 
                });
            }
            next();
        });
    },

    /*
    @fvillarrealcespedes:
    Verifies if roles from a request body exists, if not returns a error with that message, else validates the request and calls next().
    */   
    verifyRolesExists(req, res, next){
        const roles = Role.find({});
        if(req.body.roles){
            for(let i = 0; i < req.body.roles.length; i++){
                if(!roles.includes(req.body.roles[i])){
                    res.status(400).send({
                        message: `Role "${req.body.roles[i]}" doesn't exist!`,
                        code: 'roleDoesntExist'
                    });
                    return;
                }
            }
        }
        next();
    }
}