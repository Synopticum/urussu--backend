const AWS = require('aws-sdk');
const { IDENTITY_POOL_ID } = require('../../config');

AWS.config.update({
    region: 'eu-central-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID
    })
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: 'urussu' }
});

module.exports = { s3 };