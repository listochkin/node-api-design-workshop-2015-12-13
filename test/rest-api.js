'use strict';

const chai = require('chai'),
  assert = chai.assert;

const fetch = require('node-fetch'),
  co = require('co');

const jsonapiServer = require('../src/jsonapi-server'),
  authServer = require('../src/auth-proxy');

describe('REST API', () => {
  before(done => jsonapiServer.listen(5000, done));
  after(() => jsonapiServer.close());

  it('/articles', co.wrap(function* () {
    const response = yield fetch('http://localhost:5000/articles');
    assert(response.ok, '/articles response');
    const json = yield response.json();
    assert(json.data[0].id === '11', 'should have data');
  }));

  describe('Authentication & Authorization', () => {
    before(done => authServer.listen(6000, done));
    after(() => authServer.close());

    it('should authorize', co.wrap(function* () {
      const authResponse = yield fetch('http://localhost:6000/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // real-life OAuth2 requests are conducted over HTTPS only
          'Authorization': 'Basic ' + new Buffer('thom:nightworld').toString('base64')
        },
        body: 'grant_type=password&username=thomseddon&password=nightworld'
      });
      assert(authResponse.ok, '/login response');
      const authJson = yield authResponse.json();
      assert(authJson.access_token, 'No token was sent');

      const articleResponse = yield fetch('http://localhost:6000/articles/11', {
        headers: {
          'Authorization': 'Bearer ' + authJson.access_token
        }
      });
      assert(articleResponse.ok, '/articles/11 response');
      const articleJson = yield articleResponse.json();
      assert(articleJson.data.id === '11', 'should have data');
    }));
  });

});
