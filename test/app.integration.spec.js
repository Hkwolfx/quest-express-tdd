// test/app.integration.spec.js
const request = require("supertest");
const app = require("../app");
const connection = require("../connection");

// describe('Test routes', () => {
//     // truncate bookmark table before each test

//     beforeEach(done => connection.query('TRUNCATE bookmark', done));

//     // ... tests ...

//   it('GET / sends "Hello World" as json', (done) => {
//     request(app)
//       .get('/')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then(response => {
//         const expected = { message: 'Hello World!'};
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });

// it('POST /bookmarks - error (fields missing) ', (done) => {
//     request(app)
//       .post('/bookmarks')
//       .send({})
//       .expect(422)
//       .expect('Content-Type', /json/)
//       .then(response => {
//         const expected = {error: 'required field(s) missing' };
//         expect(response.body).toEqual(expected);
//         done();
//       });
//   });

//   it('POST /bookmarks - OK (fields provided) ', (done) => {
//     request(app)
//       .post('/bookmarks')
//       .send({ url: 'https://jestjs.io', title: 'Jest' })
//       .expect(201)
//       .expect('Content-Type', /json/)
//       .then(response => {
//         const expected = { id: expect.any(Number), url: 'https://jestjs.io', title: 'Jest' };
//         expect(response.body).toEqual(expected);
//         done();
//       })
//       .catch(done);
//   });
// });

describe("GET /bookmarks/:id", () => {
  const testBookmark = { url: "https://nodejs.org/", title: "Node.js" };
  beforeEach(done =>
    connection.query("TRUNCATE bookmark", () =>
      connection.query("INSERT INTO bookmark SET ?", testBookmark, done)
    )
  );

  // Write your tests HERE!
  it('GET / sends "Hello " + connection.threadId as json', done => {
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(response => {
        const expected = { message: "Hello " + connection.threadId };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("POST /bookmarks - error (fields missing) ", done => {
    request(app)
      .post("/bookmarks")
      .send({})
      .expect(422)
      .expect("Content-Type", /json/)
      .then(response => {
        const expected = { error: "required field(s) missing" };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it("GET /bookmarks/:id as json - error (id missing) ", done => {
    request(app)
      .get("/bookmarks/2")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it("GET /bookmarks/:id as json - success ", done => {
    request(app)
      .get("/bookmarks/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("POST /bookmarks - OK (fields provided) ", done => {
    request(app)
      .post("/bookmarks")
      .send({ url: "https://jestjs.io", title: "Jest" })
      .expect(201)
      .expect("Content-Type", /json/)
      .then(response => {
        const expected = {
          id: expect.any(Number),
          url: "https://jestjs.io",
          title: "Jest"
        };
        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });
});
