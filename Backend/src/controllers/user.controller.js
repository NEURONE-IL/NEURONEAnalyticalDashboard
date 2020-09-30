import User from '../models/user.model';

export default{
    async createUser(req, res){
        const user = new User(
            req.body            
        );
        await user.save((error) => {
            if(error){
                return res.status(500).json({
                    error
                });
            }
            res.status(200).send(user);
        });
    }
}