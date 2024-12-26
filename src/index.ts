import * as admin from "firebase-admin";

admin.initializeApp();
admin.firestore().settings({ignoreUndefinedProperties: true});
exports.sample_function = require("./sample_function/sample");
exports.auth_function = require("./authentication/users");
exports.counters = require('./count/counter');
exports.dashboard_graph_expenses = require('./dashboard_and_graphs/graph-expenses');
exports.dashboard_graph_sales_expenses = require('./dashboard_and_graphs/graph-sales-expenses');
exports.dashboard_graph_sales_expenses_customer = require('./dashboard_and_graphs/graph-sales-expenses-customer');
exports.customer_calculate_totals = require('./dashboard_and_graphs/receivable-and-expenses-customer');
exports.company_calculate_totals = require('./dashboard_and_graphs/company-totals');
