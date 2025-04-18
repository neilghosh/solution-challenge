import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  }  from "@google/generative-ai";
  import  { GoogleAIFileManager } from "@google/generative-ai/server";
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        common_name: {
          type: "string"
        },
        scientific_name: {
          type: "string"
        },
        indian_languages: {
          type: "object",
          properties: {
            Telugu: {
              type: "string"
            },
            Bangla: {
              type: "string"
            },
            Hindi: {
              type: "string"
            }
          }
        }
      }
    },
  };
  
  async function run(path) {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [
      await uploadToGemini(path, "image/jpeg"),
    ];
  
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            }
          ],
        }
      ],
    });
  
    const result = await chatSession.sendMessage("Identify this bird and tell what are they called in various indian languages including Bangla and Odia etc. Try to give in indian language script");
    return result.response.text();
  }
  
  export default run;
