process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import SessionSettings from '../src/models/sessionSettings.model';

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;

/*
@fvillarrealcespedes:
Test suite for SessionSettings API.
*/
describe('SessionSettings API', () => {
    /*
    @fvillarrealcespedes:
    Cleans the sessionsettings collection from DB before all tests.
    */    
    before((done) => {
        SessionSettings.deleteMany({}, (err) => {
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
    describe('/POST sessionSettings', () => {
        it('It should POST a sessionSettings', (done) => {
            let sessionSettings = new SessionSettings({
                name: 'POST Test sessionSettings',
                metrics: ['f1', 'numqueries', 'score'],
                principal: 'numqueries',
                interval: 10000,
                option: '1',
                limit: 5                
            })
            chai.request(app)
            .post('/session-settings')
            .set({ 'x-access-token': token })
            .send(sessionSettings)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('SessionSettings successfully created!');
                res.body.sessionSettings.should.have.property('name');
                res.body.sessionSettings.should.have.property('metrics');
                res.body.sessionSettings.should.have.property('principal');
                res.body.sessionSettings.should.have.property('interval');
                res.body.sessionSettings.should.have.property('option');
                res.body.sessionSettings.should.have.property('limit');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for GET route
    */    
    describe('/GET sessionSettings', () => {
        it('It should GET all sessionSettings', (done) => {
            chai.request(app)
            .get('/session-settings')
            .set({ 'x-access-token': token })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.sessionSettings.length.should.be.eq(1);
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for PUT route
    */     
    describe('/PUT/:id sessionSettings', () => {
        it('It should UPDATE a sessionSettings given the id', (done) => {
            let sessionSettings = new SessionSettings({
                name: 'PUT Test sessionSettings',
                metrics: ['activebm', 'recall', 'writtingtime'],
                principal: 'recall',
                interval: 20000,
                option: '1',
                limit: 1         
            })
            sessionSettings.save((err, sessionSettings) => {
                chai.request(app)
                .put('/session-settings/' + sessionSettings._id)
                .set({ 'x-access-token': token })
                .send({
                    name: 'PUT Updated test sessionSettings', 
                    metrics: ['entropy', 'numqueries', 'usfcover', 'writtingtime'], 
                    principal: 'numqueries',
                    interval: 20000,
                    option: '1',
                    limit: 3
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('SessionSettings successfully updated!');
                    res.body.sessionSettings.should.have.property('name').eql('PUT Updated test sessionSettings');
                    res.body.sessionSettings.should.property('metrics').to.have.lengthOf(4);
                    res.body.sessionSettings.should.have.property('principal').eql('numqueries');
                    res.body.sessionSettings.should.have.property('limit').eql(3);
                done();
                });
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for DELETE route
    */
    describe('/DELETE/:id sessionSettings', () => {
        it('It should DELETE a sessionSettings given the id', (done) => {
            let sessionSettings = new SessionSettings({
                name: 'DELETE Test sessionSettings',
                metrics: ['f1', 'numqueries', 'score'],
                principal: 'score',
                interval: 10000,
                option: '1',
                limit: 4                
            })
            sessionSettings.save((err, sessionSettings) => {
                chai.request(app)
                .delete('/session-settings/' + sessionSettings._id)
                .set({ 'x-access-token': token })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('SessionSettings successfully deleted!');
                    res.body.sessionSettings.should.have.property('name').eql('DELETE Test sessionSettings');
                done();
                });
            });
        });
    });    

    /*
    @fvillarrealcespedes:
    Successful test for GET by id route
    */
    describe('/GET/:id sessionSettings', () => {
        it('It should GET a sessionSettings given the id', (done) => {
            let sessionSettings = new SessionSettings({
                name: 'GET by id Test sessionSettings',
                metrics: ['activebm', 'f1', 'usfcover'],
                principal: 'activebm',
                interval: 10000,
                option: '1',
                limit: 2                
            })
            sessionSettings.save((err, sessionSettings) => {
                chai.request(app)
                .get('/session-settings/' + sessionSettings._id)
                .set({ 'x-access-token': token })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.sessionSettings.should.have.property('name');
                    res.body.sessionSettings.should.have.property('metrics');
                    res.body.sessionSettings.should.have.property('principal');
                    res.body.sessionSettings.should.have.property('interval');
                    res.body.sessionSettings.should.have.property('option');
                    res.body.sessionSettings.should.have.property('limit');
                    res.body.sessionSettings.should.have.property('_id').eql(sessionSettings.id)
                done();
                });
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Unsuccessful test for POST route
    */
    describe('/POST sessionSettings', () => {
        it('It should not POST a sessionSettings without principal field', (done) => {
            let sessionSettings = new SessionSettings({
                name: 'POST Test sessionSettings',
                metrics: ['f1', 'numqueries', 'score'],
                interval: 10000,
                option: '1',
                limit: 5                
            })
            chai.request(app)
            .post('/session-settings')
            .set({ 'x-access-token': token })
            .send(sessionSettings)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('err');
                res.body.err.errors.should.have.property('principal');
                res.body.err.errors.principal.should.have.property('kind').eql('required');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Cleans the sessionsettings collection from DB after all tests.
    */      
    after((done) => {        
        SessionSettings.deleteMany({}, (err) => {
            done();
        })
    });
})