import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const code = req.body.code || '';
  if (code.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid code.",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(code),
      temperature: 0.6,
      max_tokens: 100,
    });
    console.log(completion.data)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(code) {
  // const promptWithPrefix = ` State the coding language used, purpose of the code, and give it a quality ranking 
  // Code: def bubbleSort(arr):
  // n = len(arr)
  // swapped = False
  // for i in range(n-1):
  //     for j in range(0, n-i-1):
  //         if arr[j] > arr[j + 1]:
  //             swapped = True
  //             arr[j], arr[j + 1] = arr[j + 1], arr[j]
      
  //     if not swapped:
  //         return
  
  // """
  // Language: Python
  // Purpose: The code is meant to sort an array using the bubble sort algorithm.
  // Quality Rating: 9/10 - Code is concise and easy to read. The only improvement would be to check the input data type to make sure it is an array."
  // Code: ${code}`;

  const promptWithoutPrefix = ` State the coding language used, purpose of the code, and give it a quality ranking
  Code: ${code}`;

  return  promptWithoutPrefix;
}
