# Telegram YouTube Notification Bot

This project is a Telegram bot built to interact with users and prepare for future integration with the YouTube Data API to provide channel notifications. This was built as part of a live multi-part series.

## Part 1: Setup & Basic Commands

This initial part of the series focuses on laying the foundation for the bot.

-   **Bot Creation**: Setting up the bot with Telegram's @BotFather.
-   **Project Structure**: Establishing a scalable Node.js project structure with Express.
-   **Webhook Handling**: Receiving messages from Telegram via a webhook.
-   **User Interaction**: Handling new users with a `/start` command, welcoming them, and recognizing returning users.
-   **Database Integration**: Storing user information in a MongoDB database.

### Technologies Used

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **API Communication**: Axios
-   **Deployment/Webhook**: Render
-   **Development**: Nodemon for live-reloading

## Getting Started

### Prerequisites

-   Node.js installed
-   A MongoDB database (local or cloud-hosted)
-   A Telegram Bot Token from @BotFather

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root of the project and add your environment variables:
    ```env
    # Your Telegram Bot Token
    BOT_TOKEN=7828660251:AAGAUoji46BxC4pg3yJeb2AAc2HRLmGlYUM

    # Your MongoDB connection string
    MONGODB_URI=mongodb://localhost:27017/telegram_bot
    ```

### Running the Bot

-   **Development Mode** (with auto-reloading):
    ```sh
    npm run dev
    ```

-   **Production Mode**:
    ```sh
    npm run start
    ```

The server will start, typically on port 8443 as configured in [`bot.js`](bot.js).

### Setting the Telegram Webhook

After deploying your application to a public server like Render, you need to tell Telegram where to send updates. Use the following `curl` command, replacing the placeholders with your actual bot token and application URL.

```sh
curl -F "url=https://your-app-name.onrender.com/bot/message/new-message" https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```

## What’s Coming Next?

In the next part of the series, we will:
-   Integrate the **YouTube Data API**.
-   Implement features to pull data from YouTube channels and videos.
-   Set up video alerts and