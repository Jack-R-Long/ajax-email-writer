import { Configuration, OpenAIApi } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface OpenAiError extends Error {
  response: {
    status: number;
    data: {
      error: string;
    };
  }; 
}

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
  const {recipient, company, description, sentences} = req.body;
  if (!recipient || !company || !description || !sentences) {
    res.status(400).json({
      error: {
        message: "Missing required parameters",
      },
    });
    return;
  } 
  else if (sentences < 2 || sentences > 10) {
    res.status(400).json({
      error: {
        message: "Sentences must be between 2 and 10",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateEmailPrompt(recipient, company, description, sentences),
      temperature: 0.7,
      max_tokens: 256,
    });
    console.log(completion.data)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(err) {
    const openaiError = err as OpenAiError;
    // Consider adjusting the error handling logic for your use case
    if (openaiError.response) {
      console.error(openaiError.response.status, openaiError.response.data);
      res.status(openaiError.response.status).json(openaiError.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${openaiError.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateEmailPrompt(recipient: string, company: string, description: string, sentences: number) {
  console.log(recipient, company, description, sentences);
  const prompt = `Write a professional email to ${recipient} who works at ${company}.  
  Write an email describing ${description}.
  Total length ${sentences} sentences.
  `;

  return prompt;
}
