process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import User from '../src/models/user.model';

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*JWT to allow requests from registered users*/
let token;

/*
@fvillarrealcespedes:
Test suite for User API.
*/
describe('User API', () => {
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
    Successful test for POST route, NEURONE-Auth
    */
    describe('/POST user with NEURONE-Auth', () => {
        it('It should POST a user with NEURONE-Auth', (done) => {
            let user = new User({
                username: 'POST Test user NEURONE-Auth',
                email: 'user-neurone-auth@test.com',
                roles: ['user', 'admin']
            })
            chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully created!');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('roles');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for POST route, NEURONE-AD
    */
    describe('/POST user with NEURONE-AD', () => {
        it('It should POST a user with NEURONE-AD', (done) => {
            let user = new User({
                username: 'POST Test user NEURONE-AD',
                email: 'user-neurone-ad@test.com',
                password: 'POST Test password',
                roles: ['user', 'admin']
            })
            chai.request(app)
            .post('/auth/signup-ad')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully created!');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('password');
                res.body.user.should.have.property('roles');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for GET route
    */    
    describe('/GET users', () => {
        it('It should GET all users', (done) => {
            chai.request(app)
            .get('/users')
            .set({ 'x-access-token': token })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.users.length.should.be.eq(3);
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for PUT route
    */     
    describe('/PUT/:id user', () => {
        it('It should UPDATE a user given the id', (done) => {
            let user = new User({
                username: 'PUT Test user',
                email: 'put-test-user-neurone-ad@test.com',
                password: 'PUT Test password',
            })
            user.save((err, user) => {
                chai.request(app)
                .put('/user/' + user._id)
                .set({ 'x-access-token': token })
                .send({
                    username: 'PUT Updated test user', 
                    email: 'put-updated-test-user-neurone-ad@test.com',
                    password: 'PUT Updated test password',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully updated!');
                    res.body.user.should.have.property('username').eql('PUT Updated test user');
                    res.body.user.should.have.property('email').eql('put-updated-test-user-neurone-ad@test.com');
                done();
                });
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Successful test for DELETE route
    */
    describe('/DELETE/:id user', () => {
        it('It should DELETE a user given the id', (done) => {
            let user = new User({
                username: 'DELETE Test user',
                email: 'delete-test-user-neurone-ad@test.com',
                password: 'DELETE Test password'
            })
            user.save((err, user) => {
                chai.request(app)
                .delete('/user/' + user._id)
                .set({ 'x-access-token': token })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully deleted!');
                    res.body.user.should.have.property('username').eql('DELETE Test user');
                done();
                });
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Unsuccessful test for POST route, NEURONE-Auth
    */
    describe('/POST user', () => {
        it('It should not POST a user with NEURONE-Auth without email field', (done) => {
            let user = new User({
                username: 'POST Test user NEURONE-Auth',
                roles: ['admin']
            })
            chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('err');
                res.body.err.errors.should.have.property('email');
                res.body.err.errors.email.should.have.property('kind').eql('required');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Unsuccessful test for POST route, NEURONE-AD
    */
    describe('/POST user', () => {
        it('It should not POST a user with NEURONE-AD without email field', (done) => {
            let user = new User({
                username: 'POST Test user NEURONE-AD',
                password: 'POST Test password',
                roles: ['admin', 'user']
            })
            chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('err');
                res.body.err.errors.should.have.property('email');
                res.body.err.errors.email.should.have.property('kind').eql('required');
            done();
            });
        });
    });    

    /*
    @fvillarrealcespedes:
    Cleans the users collection from DB after all tests.
    */     
    after((done) => {          
        User.deleteMany({}, (err) => {
            done();
        })
    });
})