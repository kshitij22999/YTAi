import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function generateVideoData(transcript){
    if (!transcript) {
        throw new Error('Transcript is required');
    }

    const prompt = `
You are an expert content creator. Based on the transcript of a video, generate:
1. A concise and catchy title for the video (max 10 words).
2. A detailed and engaging description of the video (max 150 words).

I want the response in JSON format as below:
{
  "title": "Video Title",
  "description": "Video Description"
}

Transcript:
${transcript}
`;

try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-3.5-turbo' based on your preference
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 300, // Adjust based on expected length of response
      temperature: 0.7, // Adjust for creativity (higher = more creative)
    });

    const output = JSON.parse(response.choices[0].message.content.trim());

    // Extract title and description from the output
    const title = output.title
    const description = output.description

    return { title, description };
  } catch (error) {
    console.error('Error generating metadata:', error.message);
    throw new Error('Failed to generate metadata');
  }

}