const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS();

exports.putItemHandler = async (event, context) => {
    let response

    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`PutItem only accept POST method, you tried: ${event.httpMethod}`)
        }
        const item = await putItem(event)
        await publishSns(item)

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(item)
        }
    } catch (err) {
        response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(err)
        }
    }
    return response
}

const putItem = async (event) => {
    let response
    try {
        const body = JSON.parse(event.body)
        const id = body.id;
        const name = body.name;
        const x = body.x;
        const y = body.y;
        const owner = body.owner;
        var params = {
            TableName: process.env.SAMPLE_TABLE,
            Item: { itemID: id, name: name, x:x, y:y, owner:owner },
            ReturnValues: "ALL_OLD"
        }
        response = await docClient.put(params).promise()

    } catch (err) {
        console.log(err);
        throw err
    }
    return response
}


const publishSns = async (data) => {
    let response
    try {
        const msg = {
            TopicArn: process.env.TOPIC_ARN,
            Message: JSON.stringify({
                operation: "notifyNewItem",
                details: {
                    id: data.Attributes.itemID,
                    name: data.Attributes.name ? data.Attributes.name : "N/A",
                    x:data.Attributes.x,
                    y:data.Attributes.y
                    
                }
            }),
            MessageAttributes: {
                "Status": { "DataType": "String", "StringValue": "Success" }
            }
        }
        response = await sns.publish(msg).promise()
    } catch (err) {
        console.log(err);
        throw err
    }
    return response
}
