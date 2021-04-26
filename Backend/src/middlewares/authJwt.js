import jwt from 'jsonwebtoken';

/*
@fvillarrealcespedes:
Exports one method for JWT related operations.
*/ 
export default{
    /*
    @fvillarrealcespedes:
    Verifies the JWT from request.
    */   
    verifyToken(req, res, next){
        let token = req.headers['x-access-token'];
        if(!token){
            return res.status(401).send({ 
                message: 'NO_TOKEN_PROVIDED' 
            });
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(403).send({ 
                    message: 'UNAUTHORIZED' 
                });
            }
            req.userId = decoded.id;
            next();
        });
    }
}