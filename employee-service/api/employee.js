
'use strict';
const uuid = require('uuid');
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.add = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const name = requestBody.name;
  const email = requestBody.email;
  if (typeof name !== 'string' || typeof email !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit employee because of validation errors.'));
    return;
  }
  submitEmployeeP(employeeInfo(name, email))
    .then(res => {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: `Sucessfully submitted employee with name ${name} and email ${email}`,
          employeeId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: `Unable to submit employee with name ${name} and email ${email}`,
        })
      })
    });
};

module.exports.list = (event, context, callback) => {
  var params = {
    TableName: process.env.EMPLOYEE_TABLE,
    ExpressionAttributeNames: { "#n": "name" },
    ProjectionExpression: "id, #n, email"
  };
  console.log("Scanning Employee table.");
  const onScan = (err, data) => {
    if (err) {
      console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Scan succeeded.");
      return callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          employees: data.Items
        })
      });
    }
  };
  dynamoDb.scan(params, onScan);
};

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.EMPLOYEE_TABLE,
    Key: {
      id: event.pathParameters.id
    },
  };

  const onDelete = (err, data) => {
    if (err) {
      console.error("Unable to delete employee. Error JSON:", JSON.stringify(err, null, 2));
      callback(err);
    } else {
      console.log("Delete succeeded.");
      return callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true,
        }
      });
    }
  }

  dynamoDb.delete(params, function (err, data) {
    if (err) {
      console.error("Unable to delete employee. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("DeleteEmployee succeeded:", JSON.stringify(data, null, 2));
    }
  });
};

// helper functions
const submitEmployeeP = employee => {
  console.log('Submitting employee');
  const employeeInfo = {
    TableName: process.env.EMPLOYEE_TABLE,
    Item: employee,
  };
  return dynamoDb.put(employeeInfo).promise()
    .then(res => employee);
};
// structures name and email into JSON, and adds some timestamp metadata
const employeeInfo = (name, email) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    name: name,
    email: email,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

