import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);


export async function summarizeLogs(rawLogs: string): Promise<string> {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful system that summarizes application logs."
        },
        {
          role: "user",
          content: rawLogs
        }
      ],
      temperature: 0.4
    });

    const summary = response.data.choices?.[0]?.message?.content ?? "No summary available.";
    return summary.trim();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to summarize logs with OpenAI");
  }
}
