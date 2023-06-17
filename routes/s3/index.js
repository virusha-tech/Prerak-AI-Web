const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION
});

const s3 = new aws.S3();

module.exports = s3;
