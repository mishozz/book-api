import UserController from '../../controller/userController.js'
import mocks from 'node-mocks-http'
import * as mockingoose from 'mockingoose'
import User from '../../model/user.js'
import Book from '../../model/books.js'
import { expect } from 'chai'
import bcrypt from 'bcrypt'

const userController = new UserController();

beforeEach(() => {
    mockingoose.resetAll();
})

describe('login', () => {
    it('success', async () => {
        let req = {
            body: {
                email: 'test-name',
                password: 'test-123'
            }
        };
        
        const salt = await bcrypt.genSalt(10);
        let encryptedPass = await bcrypt.hash(req.body.password, salt);

        mockingoose(User).toReturn({
            email: 'test-name',
            password: encryptedPass,
  
          },
         'findOne');

          let res = mocks.createResponse();
          res = await userController.login(req, res);

          expect(res.statusCode).equal(200);
    });

    it('wrong password', async () => {
        let req = {
            body: {
                email: 'test-name',
                password: 'wrong-password'
            }
        };

        mockingoose(User).toReturn({
            email: 'test-name',
            password: "correct-password",
  
          },
         'findOne');

          let res = mocks.createResponse();
          res = await userController.login(req, res);

          expect(res.statusCode).equal(400);
          expect(res._getJSONData().message).equal('Incorrect email or password.')
    });

    it('wrong email', async () => {
        let req = {
            body: {
                email: 'test-name',
                password: 'wrong-password'
            }
        };

          let res = mocks.createResponse();
          res = await userController.login(req, res);

          expect(res.statusCode).equal(400);
          expect(res._getJSONData().message).equal('Incorrect email or password.')
    });
});

describe('register', () => {
    it('success', async () => {
        let req = {
            body: {
                email: 'test-name',
                password: 'test-123'
            }
        };

        let res = mocks.createResponse();
        res = await userController.register(req, res);

        expect(res.statusCode).equal(201);
    });

    it('user exists', async () => {
        let req = {
            body: {
                email: 'test-name',
                password: 'test-123'
            }
        };

        mockingoose(User).toReturn({
            email: 'test-name',
            password: "test-password",
          },
         'findOne');

        let res = mocks.createResponse();
        res = await userController.register(req, res);

        expect(res.statusCode).equal(409);
        expect(res._getJSONData().message, 'That user already exists');
    });
});

describe('getPerson', () => {
    it('success', async () => {
        let req = {
            params:{
                email: "test-email"
            }
        };

        mockingoose(User).toReturn({
            email: 'test-email',
            password: 'test-password'
        },
        'findOne')

        let res = mocks.createResponse();
        res = await userController.getPerson(req, res);

        expect(res.statusCode).equal(200);
    });

    it('not found', async () => {
        let req = {
            params:{
                email: "test-email"
            }
        };

        let res = mocks.createResponse();
        res = await userController.getPerson(req, res);

        expect(res.statusCode).equal(404);
    });
});

describe('getAll', () => {
    it('success', async () => {
        mockingoose(User).toReturn([{
            email: 'test-email',
            password: 'test-password'
        }, {
            email: 'test-email',
            password: 'test-password'
        }],
        'find');

        let req = {};

        let res = mocks.createResponse();
        res = await userController.getAll(req, res);

        expect(res._getJSONData().length).equal(2);
        expect(res.statusCode).equal(200);
    });
});

describe('handleBookActions', () => {
    it('take book success', async () => {
        mockingoose(User).toReturn({
            email: 'test-email',
            password: 'test-password'
        },
        'findOne');
        mockingoose(Book).toReturn(
            {
              _id: 'id',
              isbn: 'test-isbn',
              description:"test-desc",
              availableCopies: 10,
            },
        'findOne');
    
        let req = {
            query:{action: 'take'},
            body: {
                email:'test-email',
                isbn:'test-isbn'
            }
        };

        let res = mocks.createResponse();
        res = await userController.handleBookActions(req, res);

        expect(res.statusCode).equal(200);
    });

    it('take book - no available copies', async () => {
        mockingoose(User).toReturn({
            email: 'test-email',
            password: 'test-password'
        },
        'findOne');
        mockingoose(Book).toReturn(
            {
              _id: 'id',
              isbn: 'test-isbn',
              description:"test-desc",
              availableCopies: 0,
            },
        'findOne');
    
        let req = {
            query:{action: 'take'},
            body: {
                email:'test-email',
                isbn:'test-isbn'
            }
        };

        let res = mocks.createResponse();
        res = await userController.handleBookActions(req, res);

        expect(res.statusCode).equal(400);
    });

    it('take book - book does not exists', async () => {
        mockingoose(User).toReturn({
            email: 'test-email',
            password: 'test-password'
        },
        'findOne');
    
        let req = {
            query:{action: 'take'},
            body: {
                email:'test-email',
                isbn:'test-isbn'
            }
        };

        let res = mocks.createResponse();
        res = await userController.handleBookActions(req, res);

        expect(res.statusCode).equal(404);
    });

    // it('return book success', async () => {
    //     mockingoose(User).toReturn({
    //         email: 'test-email',
    //         password: 'test-password',
    //         takenBooks: ['id']
    //     },
    //     'findOne');
    //     mockingoose(Book).toReturn(
    //         {
    //           _id: 'id',
    //           isbn: 'test-isbn',
    //           description:"test-desc",
    //           availableCopies: 10,
    //         },
    //     'findOne');
    
    //     let req = {
    //         query:{action: 'return'},
    //         body: {
    //             email:'test-email',
    //             isbn:'test-isbn'
    //         }
    //     };

    //     let res = mocks.createResponse();
    //     res = await userController.handleBookActions(req, res);

    //     expect(res.statusCode).equal(200);
    // });

    it('no such action: bad request', async () => {  
        let req = {
            query:{action: 'wrong_action'}
        };

        let res = mocks.createResponse();
        res = await userController.handleBookActions(req, res);

        expect(res.statusCode).equal(400);
    });
});
