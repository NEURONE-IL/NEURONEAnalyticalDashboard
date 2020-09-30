import ClassroomConfiguration from '../models/classroomConfiguration.model'

export default{
    async createClassroomConfiguration(req, res){
        const classroomConfiguration = new ClassroomConfiguration(
            req.body
        );
        await classroomConfiguration.save((err) => {
            if(err){
                return res.status(500).json({
                    err
                });
            }
            res.status(200).send(classroomConfiguration);
        });
    },

    async readClassroomConfiguration(req, res){
        await ClassroomConfiguration.find((err, classroomConfigurations) => {
            if(err){
                return res.status(500).json({
                    err
                });
            }
            res.status(200).send(classroomConfigurations);
        });
    },

    async updateClassroomConfiguration(req, res){
        await ClassroomConfiguration.findByIdAndUpdate({_id: id}, req.body, (err, classroomConfiguration) => {
            if(err){
                return res.status(500).json({
                    err
                });
            }
            res.status(200).json({
                classroomConfiguration
            });
        });
    },

    async deleteClassroomConfiguration(req, res){
        const id = req.params;
        await ClassroomConfiguration.deleteOne({_id: id}, (err, classroomConfiguration) => {
            if(err){
                return res.status(500).json({
                    err
                });
            }
            res.status(200).json({
                classroomConfiguration
            });
        });
    },

    async readOneClassroomConfiguration(req, res){
        const id = req.params;
        await ClassroomConfiguration.findOne({_id: id}, (err, classroomConfiguration) => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
            res.status(200).json({
                classroomConfiguration
            });
        })
    }
}