import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'mixtral-8x7b-instruct',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
