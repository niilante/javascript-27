'use strict';

var Checker = require('jscs/lib/checker');
var assert = require('chai').assert;

describe('rules/disallow-object-method', function() {
  var checker;

  beforeEach(function() {
    checker = new Checker();
    checker.registerRule(require('../../../jscs/rules/disallow-object-method'));
  });

  describe('invalid options', function() {
    it('should throw if false', function() {
      assert.throws(function() {
        checker.configure({
          disallowObjectMethod: false
        });
      });
    });

    it('should throw if object', function() {
      assert.throws(function() {
        checker.configure({
          disallowObjectMethod: {}
        });
      });
    });

    it('should throw if array of numbers', function() {
      assert.throws(function() {
        checker.configure({
          disallowObjectMethod: [2, 3]
        });
      });
    });
  });

  describe('valid opiton', function() {
    it('should not throw if array of objects with keys', function() {
      assert.doesNotThrow(function() {
        checker.configure({
          disallowObjectMethod: [{
            object: 'foo',
            method: 'bar',
            message: 'blah blah'
          }, {
            object: 'a',
            method: 'b',
            message: 'foo foo'
          }]
        });
      });
    });

    it('should fail when using a blacklisted method', function() {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }]
      });

      assert.equal(checker.checkString('foo.bar()').getErrorCount(), 1);
    });

    it('should fail with a message when using a blacklisted method', function() {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }]
      });

      var errors = checker.checkString('foo.bar()').getErrorList();
      assert.equal(errors[0].message, 'blah blah');
    });

    it('should not fail when not using a blacklisted method', function() {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }]
      });

      assert.equal(checker.checkString('foo.baz()').getErrorCount(), 0);
    });

    it('should fail for multiple blacklisted methods', function() {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }, {
          object: 'assert',
          method: 'equals',
          message: 'boom boom'
        }]
      });

      assert.equal(checker.checkString('foo.bar(); assert.equals(2,2);').getErrorCount(), 2);
    });
  });
});
