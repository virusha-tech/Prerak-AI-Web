const express = require("express");
const db = require("../models");
const { mongoose } = require("../models/index");
const s3 = require("../s3/index");
const multerS3 = require("multer-s3");
const multer = require("multer");
const { ObjectId } = mongoose.Types;
const Character = db.character;
// const redis = require("redis");
let app = express.Router();
console.log(process.env.REDIS_PORT);
console.log(process.env.REDIS_HOST);

// Create a Redis client
// const redisClient = redis.createClient({
//   port: process.env.REDIS_PORT,
//   host: process.env.REDIS_HOST
// });

// redisClient.connect();
// redisClient.on("connect", () => {
//   console.log("Connected to Redis");
// });

// redisClient.on("error", function(error) {
//   console.error(error);
// });

// Middleware function to check cache
// const checkCache = async (req, res, next) => {
//   // Retrieve data from Redis cache
//   try {
//     const result = await redisClient.get("charaterCategoryMap");
//     if (result !== null) {
//       // Data exitts in cache, send the cached response
//       console.log("cached results");
//       // res.send();
//       res.json({
//         finalResponse: JSON.parse(result)
//       });
//     } else {
//       // Data doesn't exist in cache, move to the next middleware
//       console.log("UnCached results");
//       next();
//     }
//   } catch (e) {
//     res.send("Something went wrong");
//   }
// };

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    key: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

app.get("/charaterCategoryMap", async (req, res) => {
  try {
    Character.aggregate([
      {
        $unwind: "$characterCategory" // Breaks down the array into individual documents
      },
      {
        $match: {
          isDraft: false // Add your key and value condition here
        }
      },
      {
        $group: {
          _id: "$characterCategory", // Group by the array field values (the key)
          objects: {
            $push: "$$ROOT" // Store all the key-value pairs of the objects
          }
        }
      },
      {
        $project: {
          _id: 0,
          key: "$_id", // Rename the _id field to key
          objects: 1 // Include the objects field
        }
      }
    ]).exec((err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("results");
        const finalResponse = {};
        results.map(result => {
          finalResponse[result["key"].value] = result["objects"];
        });
        console.log(finalResponse);
        // Store the response in Redis cache with an expiration time of 24 hours (86400 seconds)
        // redisClient.set("charaterCategoryMap", JSON.stringify(finalResponse));
        console.log("Mongoose data....");
        res.json({
          finalResponse
        });
      }
    });
  } catch (e) {
    res.send("Something went wrong");
  }
});

// Endpoint to invalidate the cache
app.get("/invalidate/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  // const result = await redisClient.del(endpoint);
  res.send("Invalidated cache entry");
});

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // Calculate the number of documents to skip and limit
  const numToSkip = (page - 1) * pageSize;
  const numToLimit = pageSize;

  Character.find({}, null, { skip: numToSkip, limit: numToLimit })
    .sort({ updatedAt: -1 })
    .exec(async (err, docs) => {
      if (err) throw err;
      const alldocs = await Character.find().exec();
      res.json({ docs: docs, count: alldocs.length });
    });
});

app.get("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Character.findById(serviceId).exec();
    res.json({ ...service._doc });
  } catch (err) {
    console.log(err);
  }
});

app.post("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    // const result = await redisClient.del("charaterCategoryMap");
    Character.findByIdAndDelete(serviceId, (err, doc) => {
      res.json({ status: true });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/", upload.single("file"), async (req, res) => {
  try {
    let data = { ...req.body };
    // const result = await redisClient.del("charaterCategoryMap");
    if (req?.file?.location) {
      data = {
        ...data,
        characterProfileImage: req.file.location
      };
    }
    if (data.characterCategory) {
      data = {
        ...data,
        characterCategory: JSON.parse(data.characterCategory)
      };
    }
    const serv = await Character.updateOne(
      { _id: ObjectId(req.body.id) },
      {
        $set: { ...data }
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ id: req.body?.id || serv.upserted[0]._id });
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
