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
        User.findOne({ username: req.body.username })
            .exec((err, user) => {
                if(err){
                    return res.status(500).send({
                        err,
                        code: 'unexpectedError'
                    });
                }  
                if(user){
                    return res.status(400).send({
                        message: 'Username already in use!', 
                        code: 'usernameAlreadyInUse' 
                    });
                }
                /*Verifies if email is already in use*/
                User.findOne({ email: req.body.email })
                    .exec((err, user) => {
                        if(err){
                            return res.status(500).send({
                                err,
                                code: 'unexpectedError'
                            });
                        }  
                        if(user){
                            return res.status(400).send({ 
                                message: 'Email already in use!', 
                                code: 'emailAlreadyInUse' 
                            });
                        }
                        next();
                    });
            });
    },

    /*
    @fvillarrealcespedes:
    Finds all roles in DB, then verifies if roles from a request body exists, if not returns a error with that message, else validates the request 
    and calls next().
    */   
    async verifyRolesExists(req, res, next){
        var rolesArray = [];
        /*Finds all roles from DB*/
        await Role.find({}, function(err, roles){
            if(err){
                return res.status(500).send({
                    err,
                    code: 'unexpectedError'
                });
            }
            /*Puts all roles names in a string array*/
            roles.forEach(role => {
                rolesArray.push(role.name);
            });
        });
        /*Verifies if request body contains roles property*/
        if(req.body.roles){
            for(let i = 0; i < req.body.roles.length; i++){
                if(!rolesArray.includes(req.body.roles[i])){
                    return res.status(400).send({
                        message: `Role "${req.body.roles[i]}" doesn't exist!`,
                        code: 'roleDoesntExist'
                    });
                }
            }
        }
        next();
    }
}