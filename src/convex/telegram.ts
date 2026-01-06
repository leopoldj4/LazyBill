/**
 * Telegram notification utilities
 */

interface TelegramMessage {
	chat_id: string;
	text: string;
	parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

/**
 * Send a message via Telegram Bot API
 */
export async function sendTelegramMessage(message: string, parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'): Promise<void> {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!botToken || !chatId) {
		console.warn('Telegram credentials not configured. Skipping notification.');
		return;
	}

	const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

	const payload: TelegramMessage = {
		chat_id: chatId,
		text: message,
	};

	if (parseMode) {
		payload.parse_mode = parseMode;
	}

	try {
		const response = await fetch(telegramApiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('Failed to send Telegram message:', error);
		}
	} catch (error) {
		console.error('Error sending Telegram message:', error);
	}
}

/**
 * Send a notification when a new user signs up
 */
export async function notifyNewUserSignup(user: { name: string; email: string; id: string }): Promise<void> {
	const message = `🎉 <b>New User Signup!</b>\n\n` +
		`👤 <b>Name:</b> ${escapeHtml(user.name)}\n` +
		`📧 <b>Email:</b> ${escapeHtml(user.email)}\n` +
		`🆔 <b>User ID:</b> <code>${user.id}</code>\n` +
		`⏰ <b>Time:</b> ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`;

	await sendTelegramMessage(message, 'HTML');
}

export async function notifyFeedback(feedback: { userId: string; message: string }): Promise<void> {
	const message = `💬 <b>New Feedback!</b>\n\n` +
		`🆔 <b>User ID:</b> <code>${feedback.userId}</code>\n` +
		`📝 <b>Message:</b> ${escapeHtml(feedback.message)}\n` +
		`⏰ <b>Time:</b> ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`;

	await sendTelegramMessage(message, 'HTML');
}

/**
 * Escape HTML special characters for Telegram HTML parse mode
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
