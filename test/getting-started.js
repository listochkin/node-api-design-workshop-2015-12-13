'use strict';

const chai = require('chai'),
  assert = chai.assert;

const fetch = require('node-fetch');

const server = require('../src/hello-server');

describe('hello world', () => {
  before(done => server.listen(4000, done));
  after(() => server.close());

  it('shold respond to requests', done => {
    fetch('http://localhost:4000/').then(response => {
      assert(response.ok, 'hello world response');
      done();
    });
  });
});
