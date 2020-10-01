import User from '../models/user.model';

/*
@fvillarrealcespedes:
Exports a method for user POST operation.
*/
export default{
    /*
    @fvillarrealcespedes:
    POST a new user given a request body.
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
            res.status(200).json({
                message: 'User successfully created!', user
            });
        });
    },
}