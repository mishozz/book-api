import BookController from '../../controller/bookController.js'
import mocks from 'node-mocks-http'
import * as mockingoose from 'mockingoose'
import Book from '../../model/books.js'
import { expect } from 'chai'

const bookController = new BookController();

beforeEach(() => {
  mockingoose.resetAll();
 })

describe('createBook', () => {
    
    it('success', async () => {
      mockingoose(Book).toReturn(
        {
          isbn: 'test-isbn',
          description:"test-desc",
          availableCopies: 10,
        },
       'save');

        let req = {
          body: {
            isbn:"test-isbn",
            description:"test-desc",
            availableCopies:10
          }
        };
  
        let res = mocks.createResponse();
        res = await bookController.createBook(req, res);

        expect(res._getJSONData().isbn).equal('test-isbn')
        expect(res._getJSONData().description).equal('test-desc')
        expect(res._getJSONData().availableCopies).equal(10)
        expect(res.statusCode).equal(201)
    });

    it('conflict', async () => {
      mockingoose(Book).toReturn(
        {
          isbn: 'test-isbn',
          description:"test-desc",
          availableCopies: 10,
        },
       'findOne');

        let req = {
          body: {
            isbn:"test-isbn",
            description:"test-desc",
            availableCopies:10
          }
        };
  
        let res = mocks.createResponse();
        res = await bookController.createBook(req, res);

        expect(res.statusCode).equal(409)
    });

});

describe('getBook', () => {
  it('success', async () => {
    mockingoose(Book).toReturn(
      {
        isbn: 'test-isbn',
        description:"test-desc",
        availableCopies: 10,
      },
     'findOne');


    let req = {
      params: {
        isbn:"test-isbn"
      }
    };
    let res = mocks.createResponse();
    res = await bookController.getBook(req, res);

    expect(res._getJSONData().isbn).equal('test-isbn')
    expect(res._getJSONData().description).equal('test-desc')
    expect(res._getJSONData().availableCopies).equal(10)
    expect(res.statusCode).equal(200)
  });

  it('not found', async () => {
    let req = {
      params: {
        isbn:"test"
      }
    };
    let res = mocks.createResponse();
    res = await bookController.getBook(req, res);

    expect(res.statusCode).equal(404)
  });
})

describe('getAll', () => {
  it('success', async () => {
    mockingoose(Book).toReturn([
      {
        isbn: 'test-isbn',
        description:"test-desc",
        availableCopies: 10,
      },
      {
        isbn: 'test-isbn',
        description:"test-desc",
        availableCopies: 10,
      },
    ],
     'find');


    let req = {
      params: {
        isbn:"test"
      }
    };
    let res = mocks.createResponse();
    res = await bookController.getAll(req, res);

    expect(res._getJSONData().length).equal(2)
    expect(res.statusCode).equal(200)
  });

  describe('deleteBook', () => {
    it('success', async () => {
      mockingoose(Book).toReturn(
        {
          isbn: 'test-isbn',
          description:"test-desc",
          availableCopies: 10,
        },
       'findOne');

       let req = {
        params: {
          isbn:"test-isbn"
        }
      };

      let res = mocks.createResponse();
      res = await bookController.deleteBook(req, res);

      expect(res.statusCode).equal(204)
    })

    it('not found', async () => {
       let req = {
        params: {
          isbn:"test-isbn"
        }
      };

      let res = mocks.createResponse();
      res = await bookController.deleteBook(req, res);

      expect(res.statusCode).equal(404)
    })
  });

    
})

const book = {
  isbn: "test-isbn",
  description: "test-description",
  availableCopies: 10
};