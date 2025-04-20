# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## デバッグモード

アプリケーションのデバッグログを表示するには、環境変数`DEBUG`を設定します。

### デバッグモードの有効化

開発環境でデバッグモードを有効にするには:

```bash
# macOS/Linuxの場合
DEBUG=true npm run dev

# Windowsの場合 (PowerShell)
$env:DEBUG="true"; npm run dev

# Windowsの場合 (CMD)
set DEBUG=true && npm run dev
```

### デバッグユーティリティの使用方法

アプリケーション内でデバッグログを出力するには、標準の`console.log`の代わりに`debug`ユーティリティを使用します：

```typescript
import { debug } from './utils/debug';

// デバッグモードでのみログを出力
debug.log('デバッグ情報');
debug.info('情報');
debug.warn('警告');
debug.error('エラー');
```

---

Built with ❤️ using React Router.
