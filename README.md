Hermes: Your Logging Assistant Monorepo
=======================================

This repository is a Turborepo–based monorepo for building a full‐stack “log assistant” application. It includes:

*   A **Node/Express server** in apps/server for processing and summarizing logs.
    
*   A **Next.js web app** in apps/web that uses SWR to interface with the server.
    
*   Several **shared packages** under packages/:
    
    *   **prisma-postgres**: Prisma schema and client, pointing to a hosted Postgres DB (via Prisma Data Proxy or direct).
        
    *   **s3-uploader**: S3 upload utilities for raw logs.
        
    *   **openai-llm**: Encapsulates OpenAI calls (e.g., GPT-3.5) to summarize logs.
        
    *   **ui**: A shared component library, based on shadcn/ui, for fast, elegant React components.
        
    *   **Other** default Turbo/TypeScript config packages (eslint-config, typescript-config, etc.).
        

Quick Start
-----------

1.  **Set up the Postgres DB**
    
    *   The Prisma schema expects a valid Postgres connection. By default, the schema is hosted with Prisma’s Data Proxy or a local Postgres instance. Make sure you have your DATABASE\_URL set in .env.
        
2.  `pnpm install`
    
3.  # from the root `pnpm --filter @workspace/prisma-postgres run migrate-dev` This will run Prisma migrations against your Postgres database.
    
4.  `pnpm run build` This compiles the shared libraries (openai-llm, s3-uploader, ui, etc.) so they can be consumed by apps/server and apps/web.
    
5.  `pnpm run dev` By default, apps/server (Node/Express) will start on port 8080. apps/web (Next.js) will start on port 3000. You can then open [http://localhost:3000](http://localhost:3000) to view the UI and submit logs.
    

Using shadcn/ui in the ui Package
---------------------------------

We’ve integrated shadcn/ui to provide a shared component library in packages/ui. You can add more components via:

`pnpm dlx shadcn@latest add button -c apps/web`

This will generate the selected component(s) in packages/ui/src/components/, ready to be imported in your web app (or any other consuming project in the monorepo).

`import { Button } from "@workspace/ui/components/button"`

Your Tailwind setup (tailwind.config.ts and globals.css) is already configured to style these components.


Additional Notes
----------------

*   **Environment Variables**
    
    *   DATABASE\_URL is required for Prisma.
        
    *   AWS\_ACCESS\_KEY\_ID, AWS\_SECRET\_ACCESS\_KEY, and S3\_BUCKET\_NAME for the S3 uploader.
        
    *   OPENAI\_API\_KEY for OpenAI usage.
        
*   **Deployment**
    
    *   The Express server can be containerized or hosted on any Node environment.
        
    *   The Next.js app can be deployed to Vercel or another hosting service.
        
    *   Ensure all environment variables are set in your production environment.
        

Enjoy building with **Hermes**, your new logging assistant!