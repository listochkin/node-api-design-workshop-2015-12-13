'use strict';

const chai = require('chai'),
  assert = chai.assert;

const fetch = require('node-fetch'),
  co = require('co');

const server = require('../src/hello-server');

describe('hello world', () => {
  before(done => server.listen(4000, done));
  after(() => server.close());

  it('shold respond to requests', co.wrap(function* () {
    const response = yield fetch('http://localhost:4000/');
    assert(response.ok, 'hello world response');
    const text = yield response.text();
    assert(text === 'Hello World\n', 'showl say hello world');
  }));
});
