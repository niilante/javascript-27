'use strict';

const Checker = require('jscs/lib/checker');
const assert = require('chai').assert;

describe('rules/disallow-object-method', () => {
  let checker;

  beforeEach(() => {
    checker = new Checker();
    checker.registerRule(require('../../../jscs/rules/disallow-object-method'));
  });

  describe('invalid options', () => {
    it('should throw if object', () => {
      assert.throws(() => {
        checker.configure({
          disallowObjectMethod: {}
        });
      });
    });

    it('should throw if array of numbers', () => {
      assert.throws(() => {
        checker.configure({
          disallowObjectMethod: [2, 3]
        });
      });
    });
  });

  describe('valid opiton', () => {
    it('should not throw if array of objects with keys', () => {
      assert.doesNotThrow(() => {
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

    it('should fail when using a blacklisted method', () => {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }]
      });

      assert.equal(checker.checkString('foo.bar()').getErrorCount(), 1);
    });

    it('should fail with a message when using a blacklisted method', () => {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }]
      });

      const errors = checker.checkString('foo.bar()').getErrorList();
      assert.equal(errors[0].message, 'blah blah');
    });

    it('should not fail when not using a blacklisted method', () => {
      checker.configure({
        disallowObjectMethod: [{
          object: 'foo',
          method: 'bar',
          message: 'blah blah'
        }]
      });

      assert.equal(checker.checkString('foo.baz()').getErrorCount(), 0);
    });

    it('should fail for multiple blacklisted methods', () => {
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
