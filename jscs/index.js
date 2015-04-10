'use strict';

module.exports = function (conf) {
  conf.registerPreset('wealthfront-javascript', require('./jscs.json'));
};
