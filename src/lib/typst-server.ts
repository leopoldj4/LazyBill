export async function compile(document: string, server_url: string, token: string | null = null) {
	let headers: HeadersInit = {};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(server_url, {
		method: 'POST',
		headers,
		body: document,
	});

	if (!response.ok) {
		const error = await response.json();
		const errorMessage = error['detail'];
		throw new Error(`failed to compile document: ${errorMessage}`);
	}

	return await response.bytes();
}
