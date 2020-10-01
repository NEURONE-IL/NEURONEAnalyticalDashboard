process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import User from '../src/models/user.model';

/*Test a Node RESTful API with Mocha and Chai
https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai*/

chai.should();
chai.use(chaiHttp);

/*
@fvillarrealcespedes:
Test suite for User API.
*/
describe('User API', () => {
    /*
    @fvillarrealcespedes:
    Cleans the user collection from DB before all tests.
    */       
    before((done) => {
        User.deleteMany({}, (err) => {
            done();
        })
    });

    /**
     * @fvillarrealcespedes:
     * Successful test for POST route
     */
    describe('/POST user', () => {
        it('It should POST a user', (done) => {
            let user = new User({
                username: 'POST Test username',
                email: 'user@test.com',
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

    /**
     * @fvillarrealcespedes:
     * Unsuccessful test for POST route
     */
    describe('/POST user', () => {
        it('It should not POST a user without email field', (done) => {
            let user = new User({
                username: 'POST Test username',
                roles: ['admin']
            })
            chai.request(app)
            .post('/auth/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('email');
                res.body.errors.email.should.have.property('kind').eql('required');
            done();
            });
        });
    });

    /*
    @fvillarrealcespedes:
    Cleans the user collection from DB after all tests.
    */     
    after((done) => {          
        User.deleteMany({}, (err) => {
            done();
        })
    });
})