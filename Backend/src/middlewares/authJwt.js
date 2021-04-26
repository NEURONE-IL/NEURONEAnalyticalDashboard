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
        /*If no 'x-access-token' is provided, returns a error with that message*/
        if(!token){
            return res.status(401).send({ 
                message: 'No token provided!' 
            });
        }
        /*If JWT is not valid, returns a 'unauthorized' message, else validates the request and calls next()*/
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(403).send({ 
                    message: 'Unauthorized!' 
                });
            }
            req.userId = decoded.id;
            next();
        });
    }
}