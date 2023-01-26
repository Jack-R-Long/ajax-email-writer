import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  // TODO - better input validation
  const { reply } = req.body;

  if (!reply) {
    res.status(400).json({
      error: {
        message: "Missing required parameters",
      },
    });
    return;
  } else if (reply.length < 1 || reply.length > 500) {
    res.status(400).json({
      error: {
        message: "Invalid email length",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateEmailPrompt(reply),
      temperature: 0.7,
      max_tokens: 1000,
      frequency_penalty: 1.0,
    });
    console.log(completion.data);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (err) {
    // Consider adjusting the error handling logic for your use case
    // if (err) {
    //   const openaiError = err as OpenAiError;
    //   console.error(openaiError.response.status, openaiError.response.data);
    //   res.status(openaiError.response.status).json(openaiError.response.data);
    // } else {
    //   console.error(`Error with OpenAI API request: ${err}`);
    //   res.status(500).json({
    //     error: {
    //       message: 'An error occurred during your request.',
    //     }
    //   });
    // }
    console.error(`Error with OpenAI API request: ${err}`);
    res.status(500).json({
      error: {
        message: "Error ocurred.  OpenAI API may be down.",
      },
    });
  }
}

function generateEmailPrompt(reply: string) {
  const prompt = `Write a professional email in response to the following email.
    Email: ${reply}\n\n
    Reply: `;
  return prompt;
}
