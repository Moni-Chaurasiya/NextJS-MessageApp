// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = streamText({
//     model: openai('gpt-4-turbo'),
//     messages,
//   });

//   return result.toDataStreamResponse();
// }

/*
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai'; // Ensure these are valid
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 400,
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error);
      return NextResponse.json({ error: error.message }, { status: error.status });
    } else {
      console.error('An unexpected error occurred:', error);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}

*/
/*
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
/*
export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const stream = new ReadableStream({
      async start(controller) {
        // Iterate through the streamed chunks
        for await (const chunk of response) {
          // Extract the content from the streamed chunk
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error);
      return NextResponse.json({ error: error.message }, { status: error.status });
    } else {
      console.error('An unexpected error occurred:', error);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
}
*/
/*
export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = (await response).choices[0].text;
    const suggestedMessages = content.split('||');

    return new Response(JSON.stringify(suggestedMessages), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('An unexpected error occurred:', error);
      return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
*/

import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const decoder = new TextDecoder();
    let completeText = '';

    for await (const chunk of response) {
      const decodedChunk = decoder.decode(chunk, { stream: true });
      const parsedChunk = JSON.parse(decodedChunk);

      if (parsedChunk.choices) {
        for (const choice of parsedChunk.choices) {
          if (choice.delta && choice.delta.content) {
            completeText += choice.delta.content;
          }
        }
      }
    }

    const suggestedMessages = completeText.split('||');

    return new Response(JSON.stringify(suggestedMessages), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('An unexpected error occurred:', error);
      return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}
