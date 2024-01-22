import axios from "axios";

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY;

export const POST = async (request: Request) => {
  try {
    const data = await request.json();

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: data.message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify(response.data.candidates[0].content.parts[0]), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred", { status: 500 });
  }
};
