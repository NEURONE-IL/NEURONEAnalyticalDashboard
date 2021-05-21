import User from '../models/user.model';
import Role from '../models/role.model';
import bcryptjs from 'bcryptjs';

/*
@fvillarrealcespedes:
Exports four methods for user Read, Update and Delete operations.
*/ 
export default{
    /*
    @fvillarrealcespedes:
    GET all users.
    */       
    async readUsers(req, res){
        await User.find((err, users) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'readError'
                });
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
        await User.findOne({_id: id}, async (err, user) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'updateError'
                });
            }
            if(req.body.username){
                user.username = req.body.username;
            }
            if(req.body.email){
                user.email = req.body.email;
            }
            if(req.body.password){
                user.password = bcryptjs.hashSync(req.body.password, 8);
            }
            if(req.body.roles){
                await Role.find({ name: { $in: req.body.roles }}, (err, roles) => {
                    if(err){
                        return res.status(500).send({
                            err,
                            code: 'updateError'
                        });
                    }
                    user.roles = roles.map(role => role._id)
                });
            }
            res.status(200).json({
                message: 'User successfully updated!', 
                code: 'updateSuccess',
                user
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
                return res.status(500).send({
                    err,
                    code: 'deleteError'
                });
            }
            res.status(200).json({
                message: 'User successfully deleted!', 
                code: 'deleteSuccess',                
                user
            });
        });
    },

    /*
    @fvillarrealcespedes:
    GET a user given the id.
    */        
    async readOneUser(req, res){
        const id = req.params.id;
        await User.findOne({_id: id}, (err, user) => {
            if(err){
                return res.status(404).send({
                    err,
                    code: 'readOneError'
                });
            }
            res.status(200).json({
                user
            });
        });
    }
}
