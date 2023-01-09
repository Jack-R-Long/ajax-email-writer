import { Configuration, OpenAIApi } from "openai";
import { NextRequest } from "next/server";

export const config = {
  runtime: 'experimental-edge',
}

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

export default async function (req: NextRequest) {
  if (!configuration.apiKey) {
    return new Response(
      JSON.stringify({
        error: {
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
  // TODO - better input validation
  const {recipient, description, sentences} = req.body;
  let {company} = req.body;
  if (!company) {
    company = "none";
  }

  if (!recipient || !company || !description || !sentences) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Missing required parameters",
        },
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } 
  else if (sentences < 2 || sentences > 10) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Sentences must be between 2 and 10",
        },
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateEmailPrompt(recipient, company, description, sentences),
      temperature: 0.7,
      max_tokens: 256,
    });
    console.log(completion.data)
    return new Response(
      JSON.stringify({ result: completion.data.choices[0].text }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch(err) {
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
    return new Response(
      JSON.stringify({
        error: {
          message: 'Error ocurred.  OpenAI API may be down.',
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

function generateEmailPrompt(recipient: string, company: string, description: string, sentences: number) {
  console.log(recipient, company, description, sentences);
  let prompt = '';
  if (company === "none") {
    prompt = `Write a professional email to ${recipient}.
    Write an email describing ${description}.
    Total length ${sentences} sentences.`
  } else {
    prompt = `Write a professional email to ${recipient} who works at ${company}.  
    Write an email describing ${description}.
    Total length ${sentences} sentences.
    `;
  }
  return prompt;
}
