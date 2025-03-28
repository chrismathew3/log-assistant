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

1. run `node >= 20` (18 should be fine tbh) and install `pnpm` if you dont have it already it will change your life :p
2. `pnpm i` in the root of the monorepo to install deps
3. add an `.env` to both the `server` / `web` folders in their root respectively (server is the more important one as it contains the db string)
4. `pnpm run generate` in the prism-postgres to generate types
5. `pnpm run build` in the root of the monorepo this compiles the shared libraries (openai-llm, s3-uploader, ui, etc.) so they can be consumed by apps/server and apps/web.
6.  open a terminal for each web & server and run `pnpm dev` in each 
7.  localhost:3000 in browser and you should be good now :)

** if you run into any issues please just reach out there might be some prisma commands you need to run see the readme there if having prisma issues **
    

Using shadcn/ui in the ui Package
---------------------------------

We’ve integrated shadcn/ui to provide a shared component library in packages/ui. You can add more components via:

`pnpm dlx shadcn@latest add button -c apps/web`

This will generate the selected component(s) in packages/ui/src/components/, ready to be imported in your web app (or any other consuming project in the monorepo).

`import { Button } from "@workspace/ui/components/button"`

Your Tailwind setup (tailwind.config.ts and globals.css) is already configured to style these components.

Basic Architecture
----------------
* Next JS frontend with SWR for Caching
* Node/Express Backend
* Prisma for ORM + Hosted Postgres for convenience
* S3 to store the raw text - logs can be long and blob storage is cheap
* Store inights in the db + metadata for S3
* OpenAI for llm stuff
* Modular Monolith Architecture (put things in packages so that we get _some_ loose coupling)
* Monorepo = shared packages and single JS / TS environment + faster dev

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
