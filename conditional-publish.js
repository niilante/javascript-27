#!/usr/bin/env node

/* jshint node:true */

'use strict';

var npm = require('npm');
var git = require('git-rev');
var request = require('request');
var pkg = require('./package.json');
var name = pkg.name;
var repository = pkg.publishConfig.registry;
var version = pkg.version;

git.branch(function (branch) {
  if (branch !== 'master') {
    console.log('Not on master. Not publishing.');
    return;
  }

  request(repository + name, function (error, response, body) {
    body = JSON.parse(body);
    var versions = Object.keys(body.versions);

    if (versions.indexOf(version) === -1) {
      npm.load({}, function (err) {
        if (err) {
          console.error('Error loading package');
          throw err;
        }

        npm.commands.publish([], false, function (err, message) {
          if (err) {
            console.error('Error publishing');
            throw err;
          } else {
            console.log('Published successfully');
          }
        });
      });
    }
    else
    {
      console.log('Not a new version. Not publishing.');
    }
  });
});
