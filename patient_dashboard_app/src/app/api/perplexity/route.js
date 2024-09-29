export async function POST(request) {
	const { prompt } = await request.json();

	if (!prompt) {
		return new Response(JSON.stringify({ error: "No prompt provided" }), {
			status: 400,
		});
	}

	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, // Use environment variable for the API key
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			messages: [{ content: prompt, role: "user" }],
			model: "llama-3.1-sonar-small-128k-online",
		}),
	};

	try {
		const response = await fetch(
			"https://api.perplexity.ai/chat/completions",
			options
		);
		const data = await response.json();
		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error("Error fetching data from Perplexity API:", error);
		return new Response(
			JSON.stringify({
				error: "Error fetching data from Perplexity API",
			}),
			{ status: 500 }
		);
	}
}
