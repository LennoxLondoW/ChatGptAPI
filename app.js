const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

AI_ASSISTANT_KEY = process.env.AI_ASSISTANT_KEY;
const app = express();
app.use(cors(""));
app.use(express.json());

const port = 5000;

async function chat(messages) {
  const headers = {
    Authorization: `Bearer ${AI_ASSISTANT_KEY}`,
    "Content-Type": "application/json",
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 0.2,
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    return {
      error: {
        message: `Error! ${error}`,
      },
    };
  }
}

app.post("/chat", async (req, res) => {
  // const id = req.params.id;
  // req.body.name
  let messages = req.body.messages;
  let result;
  result = await chat(messages);
  return res.json(result);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
