import * as admin from "firebase-admin";

admin.initializeApp();
admin.firestore().settings({ignoreUndefinedProperties: true});
exports.sample_function = require("./sample_function/sample");
exports.auth_function = require("./authentication/users");
exports.counters= require('./count/counter');
