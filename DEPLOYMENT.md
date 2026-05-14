# Frontend CI/CD Deployment

This project deploys to the VPS with GitHub Actions.

## VPS path

The built frontend is deployed to:

```bash
/var/www/RegistrationFormFrontend/dist
```

The workflow keeps a timestamped backup of the previous `dist` folder before replacing it.

## Required GitHub secrets

Add these in GitHub:

`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

```bash
VPS_HOST=srv1287019
VPS_USER=root
VPS_PORT=22
VPS_SSH_KEY=<private ssh key allowed to login to the VPS>
VITE_APP_API_URL=<frontend API base URL used during vite build>
```

If SSH uses the default port, `VPS_PORT` can still be set to `22`.

## How it deploys

On every push to `main`, the workflow:

1. Installs dependencies with `npm ci`
2. Builds the frontend with `npm run build`
3. Uploads the generated `dist` folder to the VPS
4. Replaces `/var/www/RegistrationFormFrontend/dist`
5. Runs `nginx -t` and reloads Nginx when Nginx is available

You can also run it manually from the GitHub Actions tab using `workflow_dispatch`.
