'use strict';

/**
 * Disallows specific methods on objects.
 *
 * Types: `array`
 *
 * Values:
 *
 *  - array of objects specifying the object and method that are disallowed
 *      and the message that should be shown if it exists
 *
 * #### Example
 *
 * ```js
 * "disallowObjectMethod": [{
 *   object: "assert",
 *   method: "equal",
 *   message: "Use assert.strictEqual instead of assert.equal"
 * }]
 * ```
 */

const assert = require('chai').assert;

module.exports = function() {};

module.exports.prototype = {
  configure: function(options) {
    assert.isArray(options, this.getOptionName() + ' option requires array or true value');
    options.forEach(function(option) {
      assert.isObject(option, this.getOptionName() + ' requires every element to be an object');
      assert.property(option, 'object', this.getOptionName() +
        ' requires every element defines the object name to check');
      assert.property(option, 'method', this.getOptionName() +
        ' requires every element defines the method name to check');
      assert.property(option, 'message', this.getOptionName() +
        ' requires every element defines the message to show if the method is used on the object');
    }, this);

    this._options = options;
  },

  getOptionName: function() {
    return 'disallowObjectMethod';
  },

  check: function(file, errors) {
    this._options.forEach(option => {
      file.iterateNodesByType('CallExpression', node => {
        const callee = node.callee;

        if (callee.type !== 'MemberExpression') {
          return;
        }

        if (callee.object.type === 'Identifier' && callee.object.name === option.object &&
            callee.property.type === 'Identifier' && callee.property.name === option.method) {
          errors.add(option.message, callee.property.loc.start);
        }
      });
    });
  }
};
