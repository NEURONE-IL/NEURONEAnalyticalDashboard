import SessionSettings from '../models/sessionSettings.model';

export default{
    async createSessionSettings(req, res){
        const sessionSettings = new SessionSettings(
            req.body
        );
        await sessionSettings.save((error) => {
            if(error){
                return res.status(500).json({
                    error
                });
            }
            res.status(200).send(sessionSettings);
        });
    },

    async readSessionSettings(req, res){
        await SessionSettings.find((error, sessionSettings) => {
            if(error){
                return res.status(500).json({
                    error
                });
            }
            res.status(200).send(sessionSettings);
        });
    },

    async updateSessionSettings(req, res){
        await SessionSettings.findByIdAndUpdate({_id: id}, req.body, (error, sessionSettings) => {
            if(error){
                return res.status(500).json({
                    error
                });
            }
            res.status(200).json({
                sessionSettings
            });
        });
    },

    async deleteSessionSettings(req, res){
        const id = req.params;
        await SessionSettings.deleteOne({_id: id}, (error, sessionSettings) => {
            if(error){
                return res.status(500).json({
                    error
                });
            }
            res.status(200).json({
                sessionSettings
            });
        });
    },

    async readOneSessionSettings(req, res){
        const id = req.params;
        await SessionSettings.findOne({_id: id}, (error, sessionSettings) => {
            if(error){
                return res.status(404).json({
                    error
                });
            }
            res.status(200).json({
                sessionSettings
            });
        })
    }
}