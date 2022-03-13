import UserController from '../../controller/userController.js'
import mocks from 'node-mocks-http'
import * as mockingoose from 'mockingoose'
import User from '../../model/user.js'
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
                username: 'test-name',
                password: 'test-123'
            }
        };
        
        const salt = await bcrypt.genSalt(10);
        let encryptedPass = await bcrypt.hash(req.body.password, salt);

        mockingoose(User).toReturn({
            username: 'test-name',
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
                username: 'test-name',
                password: 'wrong-password'
            }
        };

        mockingoose(User).toReturn({
            username: 'test-name',
            password: "correct-password",
  
          },
         'findOne');

          let res = mocks.createResponse();
          res = await userController.login(req, res);

          expect(res.statusCode).equal(400);
          expect(res._getJSONData().message).equal('Incorrect username or password.')
    });

    it('wrong username', async () => {
        let req = {
            body: {
                username: 'test-name',
                password: 'wrong-password'
            }
        };

          let res = mocks.createResponse();
          res = await userController.login(req, res);

          expect(res.statusCode).equal(400);
          expect(res._getJSONData().message).equal('Incorrect username or password.')
    });
});

describe('register', () => {
    it('success', async () => {
        let req = {
            body: {
                username: 'test-name',
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
                username: 'test-name',
                password: 'test-123'
            }
        };

        mockingoose(User).toReturn({
            username: 'test-name',
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
                username: "test-username"
            }
        };

        mockingoose(User).toReturn({
            username: 'test-username',
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
                username: "test-username"
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
            username: 'test-username',
            password: 'test-password'
        }, {
            username: 'test-username',
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
