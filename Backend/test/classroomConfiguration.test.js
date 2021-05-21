process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import ClassroomConfiguration from '../src/models/classroomConfiguration.model';

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;

/*
@fvillarrealcespedes:
Test suite for ClassroomConfiguration API.
*/
describe('ClassroomConfiguration API', () => {
    /*
    @fvillarrealcespedes:
    Cleans the classroomconfigurations collection from DB before the tests.
    */
    before((done) => {
        ClassroomConfiguration.deleteMany({}, (err) => {
            done();
        })
    });

    /*
    @fvillarrealcespedes:
    Tries to authenticate the default user to get a JWT before apply each test.
    */    
    beforeEach((done) => {
        chai.request(app)
        .post('/auth/login')
        .send({
            username: 'neuroneadadmin',
            password: 'neuronead2020'
        })
        .end((err, res) => {
            token = res.body.accessToken;
            res.should.have.status(200);
            done();
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for POST route    
    */
    describe('/POST classroomConfiguration', () => {
        it('It should POST a classroomConfiguration', (done) => {
            let classroomConfiguration = new ClassroomConfiguration({
                name: 'POST Test classroomConfiguration',
                createdBy: 'POST Test creator',
                lastEditedBy: 'POST Test editor',
                participants: 6,
                positions: [[50, 50], [150, 50], [250, 50], [50, 150], [150, 150], [250, 150]],
                height: 550,
                width: 1130           
            })
            chai.request(app)
            .post('/classroom-configuration')
            .set({ 'x-access-token': token })
            .send(classroomConfiguration)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('ClassroomConfiguration successfully created!');
                res.body.classroomConfiguration.should.have.property('name');
                res.body.classroomConfiguration.should.have.property('createdBy');
                res.body.classroomConfiguration.should.have.property('lastEditedBy');
                res.body.classroomConfiguration.should.have.property('participants');
                res.body.classroomConfiguration.should.have.property('positions');
                res.body.classroomConfiguration.should.have.property('height');
                res.body.classroomConfiguration.should.have.property('width');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for GET route
    */    
    describe('/GET classroomConfigurations', () => {
        it('It should GET all classroomConfigurations', (done) => {
            chai.request(app)
            .get('/classroom-configurations')
            .set({ 'x-access-token': token })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.classroomConfigurations.length.should.be.eq(1);
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for PUT route
    */     
    describe('/PUT/:id classroomConfiguration', () => {
        it('It should UPDATE a classroomConfiguration given the id', (done) => {
            let classroomConfiguration = new ClassroomConfiguration({
                name: 'PUT Test classroomConfiguration',
                createdBy: 'PUT Test creator',
                lastEditedBy: 'PUT Test editor',
                participants: 5,
                positions: [[60, 60], [160, 60], [260, 60], [60, 160], [160, 160]],
                height: 500,
                width: 1080           
            })
            classroomConfiguration.save((err, classroomConfiguration) => {
                chai.request(app)
                .put('/classroom-configuration/' + classroomConfiguration._id)
                .set({ 'x-access-token': token })
                .send({
                    name: 'PUT Updated test classroomConfiguration',
                    createdBy: 'PUT Updated test creator',
                    lastEditedBy: 'PUT Updated test editor',
                    participants: 4,
                    positions: [[50, 50], [150, 50], [250, 50], [50, 150]],
                    height: 500,
                    width: 1080   
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('ClassroomConfiguration successfully updated!');
                    res.body.classroomConfiguration.should.have.property('name').eql('PUT Updated test classroomConfiguration');
                    res.body.classroomConfiguration.should.have.property('createdBy').eql('PUT Updated test creator');
                    res.body.classroomConfiguration.should.have.property('lastEditedBy').eql('PUT Updated test editor');
                    res.body.classroomConfiguration.should.have.property('participants').eql(4);
                    res.body.classroomConfiguration.should.property('positions').to.have.lengthOf(4);                    
                done();
                });
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for DELETE route
    */
    describe('/DELETE/:id classroomConfiguration', () => {
        it('It should DELETE a classroomConfiguration given the id', (done) => {
            let classroomConfiguration = new ClassroomConfiguration({
                name: 'DELETE Test classroomConfiguration',
                createdBy: 'DELETE Test creator',
                lastEditedBy: 'DELETE Test editor',
                participants: 6,
                positions: [[70, 70], [170, 70], [270, 70], [70, 170], [170, 170], [270, 170]],
                height: 520,
                width: 1100           
            })
            classroomConfiguration.save((err, classroomConfiguration) => {
                chai.request(app)
                .delete('/classroom-configuration/' + classroomConfiguration._id)
                .set({ 'x-access-token': token })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('ClassroomConfiguration successfully deleted!');
                    res.body.classroomConfiguration.should.have.property('name').eql('DELETE Test classroomConfiguration');
                done();
                });
            });
        });
    });    

    /*
    @fvillarrealcespedes:
    Successful test for GET by id route
    */
    describe('/GET/:id classroomConfiguration', () => {
        it('It should GET a classroomConfiguration given the id', (done) => {
            let classroomConfiguration = new ClassroomConfiguration({
                name: 'GET by id Test classroomConfiguration',
                createdBy: 'GET by id Test creator',
                lastEditedBy: 'GET by id Test editor',
                participants: 3,
                positions: [[40, 40], [140, 40], [240, 40]],
                height: 275,
                width: 565           
            })
            classroomConfiguration.save((err, classroomConfiguration) => {
                chai.request(app)
                .get('/classroom-configuration/' + classroomConfiguration._id)
                .set({ 'x-access-token': token })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.classroomConfiguration.should.have.property('name');
                    res.body.classroomConfiguration.should.have.property('createdBy');
                    res.body.classroomConfiguration.should.have.property('lastEditedBy');
                    res.body.classroomConfiguration.should.have.property('participants');
                    res.body.classroomConfiguration.should.have.property('positions');
                    res.body.classroomConfiguration.should.have.property('height');
                    res.body.classroomConfiguration.should.have.property('width');
                    res.body.classroomConfiguration.should.have.property('_id').eql(classroomConfiguration.id)
                done();
                });
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Unsuccessful test for POST route
    */
    describe('/POST classroomConfiguration', () => {
        it('It should not POST a classroomConfiguration without participants field', (done) => {
            let classroomConfiguration = new ClassroomConfiguration({
                name: 'POST Test classroomConfiguration',
                createdBy: 'POST Test creator',
                lastEditedBy: 'POST Test editor',
                positions: [[50, 50], [150, 50], [250, 50], [50, 150], [150, 150], [250, 150]],
                height: 550,
                width: 1130           
            })
            chai.request(app)
            .post('/classroom-configuration')
            .set({ 'x-access-token': token })
            .send(classroomConfiguration)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('err');
                res.body.err.errors.should.have.property('participants');
                res.body.err.errors.participants.should.have.property('kind').eql('required');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Cleans the classroomconfigurations collection from DB after the tests.
    */   
    after((done) => {
        ClassroomConfiguration.deleteMany({}, (err) => {
            done();
        })
    });
})