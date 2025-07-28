import { NextResponse } from 'next/server';


var message_history: string[] = [];

export async function POST(request: Request) {

    const { message } = await request.json();
    const api = 'http://localhost:8000/chat';
    const response = await fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_prompt: message,
            message_history: message_history
        }),
    });

    const data = await response.json();


    const aiMessage = data['message'];
    message_history = data['message_history'];
    console.log('AI message history:', message_history);
    console.log('AI message:', aiMessage);

    return NextResponse.json({ message: aiMessage });

}
