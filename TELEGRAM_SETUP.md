# Telegram Signup Notifications Setup

This guide explains how to configure Telegram notifications for new user signups in LazyBill.

## Prerequisites

1. A Telegram account
2. The Telegram app (mobile or desktop)

## Setup Steps

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat and send the command: `/newbot`
3. Follow the prompts to choose a name and username for your bot
4. BotFather will give you a **Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Save this token - you'll need it in step 3

### 2. Get Your Chat ID

**Option A: Using your personal chat**
1. Search for your bot in Telegram and start a chat
2. Send any message to the bot
3. Open this URL in your browser (replace `YOUR_BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for the `"chat":{"id":` field in the response
5. Copy the numeric ID (can be negative, that's fine)

**Option B: Using a group chat**
1. Create a new Telegram group
2. Add your bot to the group (search by username and add it as a member)
3. Send a message in the group
4. Open this URL in your browser:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
5. Look for the `"chat":{"id":` field - group IDs are usually negative numbers
6. Copy the Chat ID

### 3. Configure Environment Variables in Convex

1. Open your Convex dashboard at https://dashboard.convex.dev
2. Select your LazyBill project
3. Go to **Settings** → **Environment Variables**
4. Add the following two variables:
   - **Name:** `TELEGRAM_BOT_TOKEN`
     - **Value:** Your bot token from step 1
   - **Name:** `TELEGRAM_CHAT_ID`
     - **Value:** Your chat ID from step 2

5. Click **Save** for each variable

### 4. Deploy and Test

1. Deploy your changes:
   ```bash
   npx convex deploy
   ```

2. Test the integration by creating a new test user signup (if you have a test environment)

3. You should receive a message in your Telegram chat like:
   ```
   🎉 New User Signup!

   👤 Name: John Doe
   📧 Email: john@example.com
   🆔 User ID: 123abc456def
   ⏰ Time: 06.01.2026, 15:30:00
   ```

## Troubleshooting

### Not receiving messages?

1. **Check environment variables**: Make sure both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set correctly in Convex dashboard
2. **Check bot permissions**: If using a group, make sure the bot wasn't removed and has permission to post
3. **Test the bot token**: Use this URL to check if your bot is active:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getMe
   ```
4. **Check Convex logs**: Look for any error messages in your Convex function logs
5. **Verify the chat ID**: Make sure you're using the correct chat ID (including the minus sign if it's a group)

### Messages going to the wrong chat?

Double-check your `TELEGRAM_CHAT_ID` value. You can verify it using the `getUpdates` method described in step 2.

## Security Notes

- Never commit your bot token to version control
- Keep your bot token and chat ID secure
- If you believe your token has been compromised, revoke it using BotFather (`/revoke`) and create a new bot
- The bot token and chat ID are stored securely in Convex's environment variables system

## Customizing Notifications

To customize the notification message format, edit the `notifyNewUserSignup` function in `/src/convex/telegram.ts`.
