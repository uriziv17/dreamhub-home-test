# Notifications

A React + TypeScript app for live notifications. The app connects over a WebSocket to a small Node server that pushes notification messages in real time. UI is built with Ant Design.

## Prerequisites

- [Node.js](https://nodejs.org/) (18+ recommended)
- npm

## Install

From the `notifications/` folder, install dependencies:

```bash
npm install
```

## Running locally

The app needs two processes running at the same time: the WebSocket server and the Vite dev server.

### 1. Start the server

The server (`server.js`) runs a WebSocket server on port **8080** and pushes a random notification every 2 seconds to each connected client.

```bash
node ./server.js
```

### 2. Start the app

In a second terminal, start the Vite dev server:

```bash
npm run dev
```

Then open the URL Vite prints (by default http://localhost:5173) in your browser. The app connects to the server at `ws://localhost:8080` and displays notifications as they arrive.

## Other scripts

- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
