const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  console.log(body);
  try {
    var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

    const isTableExist = await checkTable(ddb);
    if (!isTableExist) {
      await createTable(ddb);
    }

    await uploadItemToTable(body, ddb);
  } catch (error) {
    console.log("error==", error);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify("Update user status successfully"),
  };
  return response;
};

const createTable = async (ddb) => {
  var ddbTableParams = {
    AttributeDefinitions: [
      {
        AttributeName: "userName",
        AttributeType: "S",
      },
      {
        AttributeName: "email",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "userName",
        KeyType: "HASH",
      },
      {
        AttributeName: "email",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: "userDetails",
    StreamSpecification: {
      StreamEnabled: false,
    },
  };

  await ddb
    .createTable(ddbTableParams)
    .promise()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("Error", error);
    });
};

const checkTable = async (ddb) => {
  console.log("Check table: ", "userDetails");
  var params = {
    TableName: "userDetails",
  };

  await ddb
    .describeTable(params)
    .promise()
    .then((data) => {
      return "true";
    })
    .catch((error) => {
      return "false";
    });
};

const uploadItemToTable = async (fileData, ddb) => {
  var getParams = {
    TableName: "userDetails",
    Key: {
      userName: { S: fileData.userName },
    },
  };

  // Call DynamoDB to read the item from the table
  const filteredItem = await ddb
    .getItem(getParams)
    .promise()
    .then((data) => {
      return data.Item;
    })
    .catch((error) => {
      console.log("Error", error);
    });
  var params;
  if (filteredItem) {
    params = {
      TableName: "userDetails",
      Key: {
        userName: { S: fileData.userName },
      },
      UpdateExpression: "set #a = :x",
      ExpressionAttributeNames: {
        "#a": "status",
      },
      ExpressionAttributeValues: {
        ":x": { S: fileData.type == "login" ? "true" : "false" },
      },
    };

    const updateData = await ddb
      .updateItem(params)
      .promise()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log("Error", error);
      });
  } else {
    params = {
      TableName: "userDetails",
      Item: {
        userName: { S: fileData.userName.toString() },
        email: { S: fileData.email.toString() },
        status: { S: "true" },
      },
    };

    await ddb
      .putItem(params)
      .promise()
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
};
