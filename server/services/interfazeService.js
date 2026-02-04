const axios = require("axios");

exports.generateSummary = async ({ image, prompt }) => {
  const response = await axios.post(
    "https://api.interfaze.ai/v1/chat/completions",
    {
      model: "auto",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.INTERFAZE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};
