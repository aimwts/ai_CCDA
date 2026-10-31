# Deploying the frontend to Netlify

This repository contains a Vite frontend and a separate Express/WebSocket backend. Netlify can build and host the static frontend. Deploy the backend and PostgreSQL database on services that support the Node server and persistent WebSocket connections.

## Netlify setup

1. Push this repository to GitHub and import it in Netlify.
2. Netlify reads the root `netlify.toml`: it builds from `frontend`, runs `npm run build`, publishes `frontend/dist`, and routes client-side pages such as `/history` back to `index.html`.
3. In the Netlify site environment variables, set:

   - `VITE_API_URL` to the public HTTPS origin for the backend API, for example `https://api.example.com`.
   - `VITE_WS_URL` to the public secure WebSocket endpoint, for example `wss://ws.example.com`.

4. Redeploy after setting the variables. Vite embeds these values into the frontend at build time.

The frontend currently uses the backend's default WebSocket token `my-secret-token`. For a non-demo deployment, configure `WS_TOKEN` on the backend and add the matching `VITE_WS_TOKEN` to the Netlify build environment. Values prefixed with `VITE_` are included in browser code and must not be treated as secrets; this token is only a basic demo gate, not user authentication.

## Backend requirements

- In Supabase, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor.
- Set `DATABASE_URL` on the backend host to the Supabase PostgreSQL connection string copied from **Connect**. Use the direct connection for a backend host with IPv6; use the session pooler if the backend host only supports IPv4. Require TLS with `sslmode=require`.
- The backend uses `pg.Pool` and writes machine, SenseHat, and system readings once per minute by default. Set `HISTORY_SAMPLE_INTERVAL_MS` to change the sampling interval and `DB_POOL_MAX` to change the backend connection-pool size.
- Set `API_PORT` (or use the host-provided `PORT`) and `WS_PORT` to the ports exposed by the backend host.
- Set `WS_TOKEN` to the value configured as `VITE_WS_TOKEN` in Netlify.
- Set `CORS_ORIGIN` to the deployed Netlify site origin (comma-separated if you use multiple frontend origins).
- Keep hardware services on a network that can reach the backend. Local device integrations cannot run inside the static Netlify site.

Use [`backend/.env.example`](backend/.env.example) as the local variable template. Keep the actual database password in the backend host's environment settings, never in a `VITE_` variable or committed file.

After configuring the backend and applying the schema, verify both by opening `https://<your-api-host>/health/db`; a healthy connection returns `{"status":"ok","database":"connected","schema":"ready"}`.
