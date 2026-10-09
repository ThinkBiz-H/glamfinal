# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- React + Vite (SPA)
- TanStack Router
- TypeScript
- Tailwind CSS

## Deployment

This builds to a standard static `dist/` folder (`npm run build`) — deploy it
to any static host (Netlify, Vercel, Cloudflare Pages, S3/CloudFront, GitHub
Pages, nginx, etc.).

Because this is a client-side-routed single-page app, the host must serve
`index.html` for any unmatched path (so refreshing or directly linking to a
route like `/services` works). A `public/_redirects` file is included for
Netlify; most other providers (Vercel, Cloudflare Pages) detect this
automatically, and a plain nginx/Apache host needs an equivalent
`try_files ... /index.html` rewrite rule.

