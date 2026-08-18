Deployment guide — Vercel and Render

Summary
- This repository is a monorepo with workspaces and four front-end apps under frontend/:
  - frontend/customer-app
  - frontend/owner-app
  - frontend/staff-app
  - frontend/admin-app
- Each frontend is a Vite React app. The root package.json exposes workspace build scripts:
  - npm run build:customer
  - npm run build:owner
  - npm run build:staff
  - npm run build:admin

Goal
- Deploy each frontend as an independent static site on Vercel and Render.

Important notes
- Because this is a monorepo with a shared package (packages/shared-ui), build must run from the repo root so the workspace packages are installed and hoisted correctly. The provided commands below run install at the root and then run the workspace build script.
- Vite output directory for each app will be frontend/<app>/dist after building from the root workspace command.

Vercel — per-dashboard projects (recommended)
1. In Vercel, create a new project and import the repository (GitHub/GitLab/Bitbucket).
2. For each dashboard create a separate Vercel project. When configuring each project:
   - Root Directory: leave blank (set to repository root) OR set to the repo root if Vercel asks.
   - Framework Preset: "Other" or allow Vercel to autodetect; the important part is the Build Command and Output Directory.
   - Build Command: npm ci && npm run build:customer
     - Replace `build:customer` with `build:owner`, `build:staff`, or `build:admin` for the other projects.
   - Output Directory: frontend/customer-app/dist
     - Replace the path for each project accordingly (frontend/owner-app/dist, frontend/staff-app/dist, frontend/admin-app/dist).
   - Environment variables: add any required for runtime (e.g., REACT_APP_API_URL or VITE_API_URL depending on how the app reads backend URL). The apps use a shared api client; ensure API_BASE_URL or similar is set if required.
3. Deploy. Vercel will run npm ci at the repo root, install workspace packages, and then run the single workspace build script to produce the dist in the correct subfolder.

Render — Static Sites (per-dashboard)
1. In Render, create a new Static Site for each dashboard.
2. For each site, configure:
   - Name: e.g., elaris-customer-app
   - Environment: Static Site
   - Branch: main (or your chosen branch)
   - Root Directory: <leave empty> OR set to repo root (Render supports monorepo builds via Build Command and Publish Directory)
   - Build Command: npm ci && npm run build:customer
     - Replace build:customer for other dashboards
   - Publish Directory: frontend/customer-app/dist
     - Replace per dashboard
   - Environment variables: add API URL and any others required.
3. Trigger manual deploy or push to branch to auto-deploy.

render.yaml (template)
- Render supports a render.yaml file to define infrastructure as code. A template (render-template.yaml) is included in this repo — edit it to set repo names / branches / environment variables before using.

Local testing
- From repo root, run:
  - npm ci
  - npm run dev:customer  (or owner/staff/admin)
- To build just customer app locally: npm run build:customer
  - Then preview the static output in frontend/customer-app/dist (or run `npx serve frontend/customer-app/dist`)

Checklist before deployment
- Push this repo to a Git provider (GitHub, GitLab, Bitbucket).
- Ensure any necessary environment variables (API base URL, auth keys) are added to each Vercel and Render project.
- If you want help creating the Git repository and connecting to Vercel/Render (I can prepare a branch and push), reply with the repository URL or grant access.

If you want, I can also create Render/Vercel projects for you — I will need repository access and deployment account access (or you can connect the repo and I will provide the build settings to paste).