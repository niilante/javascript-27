'use strict';

module.exports = function(conf) {
  conf.registerRule(require('./rules/disallow-object-method.js'));
  conf.registerPreset('wealthfront-javascript', require('./jscs.json'));
};
