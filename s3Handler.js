const AWS = require('aws-sdk')
const fs = require('fs');
require('dotenv').config()
const queries = require('./db/queries')


const BUCKET_NAME = process.env.BUCKET_NAME
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


async function uploadFile(filePath, storeName, fn) {
    // Read content from the file
    const fileContent = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: storeName, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, fn);
};


module.exports = {
    uploadAndUpdateNPC: async (npc, location) => {
        console.log('uploading ..')

        const fn = (err, data) => {
            if (err) { throw err } else {
                console.log(`uploaded to ${data.Location}`)
                npc.imageURL = data.Location
                queries.updateGeneric('npc', npc.id, npc).catch(e => { throw e })
            }
        }

        const pathAndName = 'npc' + '/' + npc.id
        uploadFile(location, pathAndName, fn)

    }
}

