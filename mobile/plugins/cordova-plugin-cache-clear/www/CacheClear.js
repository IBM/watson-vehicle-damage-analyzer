//////////////////////////////////////////
// CacheClear.js
// Copyright (C) 2016 Anrip <mail@anrip.com>
//
//////////////////////////////////////////

var exec = require('cordova/exec');

var CacheClear = function (success, error) {
    exec(success, error, 'CacheClear', 'task', []);
};

module.exports = CacheClear;
