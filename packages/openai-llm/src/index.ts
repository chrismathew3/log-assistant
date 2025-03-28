import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);


export async function summarizeLogs(rawLogs: string): Promise<string> {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o", // or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: `You are an expert log analyzer. 
Given a set of application logs, provide a short, plain-English summary that highlights:
1) The main issues or errors
2) The likely causes
3) Any recommended actions or next steps

Keep the summary concise, typically in a single paragraph or a few bullet points. 
Use a professional but clear tone, avoiding unnecessary technical jargon.
If the logs indicate a database or network issue, mention that specifically 
along with possible steps to resolve it.`
        },
        {
          role: "user",
          content: rawLogs
        }
      ],
      temperature: 0.4,
      // You could also tweak `max_tokens` or other parameters here
    });

    const summary = response.data.choices?.[0]?.message?.content ?? "No summary available.";
    return summary.trim();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new Error("Failed to summarize logs with OpenAI");
  }
}
