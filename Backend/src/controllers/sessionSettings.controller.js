import SessionSettings from '../models/sessionSettings.model';

/*
@fvillarrealcespedes:
Exports five methods for sessionSettings CRUD operations.
*/ 
export default{
    /*
    @fvillarrealcespedes:
    POST a new sessionSettings given a request body.
    */    
    async createSessionSettings(req, res){
        const sessionSettings = new SessionSettings(
            req.body
        );
        await sessionSettings.save((err, sessionSettings) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'createError'
                });
            }
            res.status(200).json({
                message: 'SessionSettings successfully created!', 
                code: 'createSuccess',
                sessionSettings
            });
        });
    },

    /*
    @fvillarrealcespedes:
    GET all sessionSettings.
    */     
    async readSessionSettings(req, res){
        await SessionSettings.find((err, sessionSettings) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'readError'
                });
            }
            res.status(200).json({
                sessionSettings
            });
        });
    },

    /*
    @fvillarrealcespedes:
    UPDATE a sessionSettings given the id and a request body.
    */    
    async updateSessionSettings(req, res){
        const id = req.params.id;
        await SessionSettings.findByIdAndUpdate({_id: id}, req.body, {new: true}, (err, sessionSettings) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'updateError'
                });
            }
            res.status(200).json({
                message: 'SessionSettings successfully updated!', 
                code: 'updateSuccess',
                sessionSettings
            });
        });
    },

    /*
    @fvillarrealcespedes:
    DELETE a sessionSettings given the id.
    */    
    async deleteSessionSettings(req, res){
        const id = req.params.id;
        await SessionSettings.findByIdAndDelete({_id: id}, (err, sessionSettings) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'deleteError'
                });
            }
            res.status(200).json({
                message: 'SessionSettings successfully deleted!', 
                code: 'deleteSuccess',
                sessionSettings
            });
        });
    },

    /*
    @fvillarrealcespedes:
    GET a sessionSettings given the id.
    */        
    async readOneSessionSettings(req, res){
        const id = req.params.id;
        await SessionSettings.findOne({_id: id}, (err, sessionSettings) => {
            if(err){
                return res.status(404).send({
                    err,
                    code: 'readOneError'
                });
            }
            res.status(200).json({
                sessionSettings
            });
        });
    }
}