const express = require("express");
const openai = require("../middlewares/openai");

let app = express.Router();

app.post("/subsequentQuestion", async (req, res, next) => {
  try {
    let { conversation } = req.body;
    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversation
    });
    let output = `${gptResponse.data.choices[0].message.content}`;
    res.send({
      answer: output
    });
  } catch (err) {
    console.log(err.response);
    console.log(err.data);
    console.log(err.message);
  }
});

module.exports = app;
