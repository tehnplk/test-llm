import { NextApiRequest, NextApiResponse } from 'next';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatRequest extends NextApiRequest {
    body: {
        message: string;
        messages: Message[];
    }
}

interface ChatResponse {
    message: string;
}

export default async function handler(
    req: ChatRequest,
    res: NextApiResponse<ChatResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, messages } = req.body;

    try {
        // Replace with your preferred LLM API (OpenAI, Anthropic, etc.)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    ...messages,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to get response from LLM');
        }

        const aiMessage: string = data.choices[0].message.content;

        res.status(200).json({ message: aiMessage });
    } catch (error) {
        console.error('Error calling LLM:', error);
        res.status(500).json({
            message: 'Sorry, I encountered an error. Please try again.'
        });
    }
}