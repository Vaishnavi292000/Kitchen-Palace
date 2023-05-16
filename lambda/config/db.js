var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
const tableName = "e37e5aad-0527-4c79-9416-192220399239";

var dbConfig = function () { };
var docClient = new AWS.DynamoDB.DocumentClient();

dbConfig.prototype.addWorkFlow = (workflow) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: workflow
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert");
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbConfig.prototype.getWorkFlow = (workflowID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            KeyConditionExpression: "#workflowID = :workflow_id",
            ExpressionAttributeNames: {
                "#workflowID": "id"
            },
            ExpressionAttributeValues: {
                ":workflow_id": workflowID
            }
        }
        docClient.query(params, (err, data) => {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            } 
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            resolve(data.Items)
            
        })
    });
}

dbConfig.prototype.getWorkFlowList = () => {
  return new Promise(async(resolve, reject) => {
    let data=[]
    for(let i = 1; i <= 5; i++) {
        try{
            let res=await getData(i.toString())
            if(res.length>0){
            data.push(res[0])
        }else
            break;
        }
        catch(ex){
            break;
        }
    }
    resolve(data)
  });
}

const getData = (key) => {
 return new Promise((resolve, reject) => {
     const params = {
         TableName: tableName,
         KeyConditionExpression: "#workflowID = :workflow_id",
         ExpressionAttributeNames: {
         "#workflowID": "id"
         },
         ExpressionAttributeValues: {
         ":workflow_id": key
         }
    }
     docClient.query(params, (err, data) => {
     if (err) {
         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
         return reject(JSON.stringify(err, null, 2))
     }
     resolve(data.Items)
     })
 })
}

dbConfig.prototype.removeWorkflow = (workflowID) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "workflowID": workflowID
            },
            ConditionExpression: "attribute_exists(workflowID)"
        }
        docClient.delete(params, function (err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            }
            console.log(JSON.stringify(err));
            console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            resolve()
        })
    });
}

module.exports = new dbConfig();