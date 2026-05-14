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
VPS_HOST=<your VPS public IP address or public domain>
VPS_USER=root
VPS_PORT=22
VPS_SSH_KEY=<private ssh key allowed to login to the VPS>
VITE_APP_API_URL=<frontend API base URL used during vite build>
```

If SSH uses the default port, `VPS_PORT` can still be set to `22`.

Use the VPS public IP address or a DNS name that GitHub Actions can resolve. Do not use only the local shell prompt hostname like `srv1287019` unless that hostname resolves publicly.

## Fix SSH permission denied

If the workflow shows `Permission denied (publickey,password)`, GitHub Actions connected to the VPS but the key was rejected.

Create a deploy key on your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-registration-frontend" -f ~/.ssh/registration_frontend_deploy
```

Copy the public key to the VPS user that deploys the app:

```bash
ssh-copy-id -i ~/.ssh/registration_frontend_deploy.pub root@YOUR_SERVER_PUBLIC_IP
```

Or manually add the public key on the VPS:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Then put the private key content into the GitHub secret `VPS_SSH_KEY`:

```bash
cat ~/.ssh/registration_frontend_deploy
```

Paste the full private key, including:

```bash
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Test from your machine before running GitHub Actions:

```bash
ssh -i ~/.ssh/registration_frontend_deploy root@YOUR_SERVER_PUBLIC_IP
```

If this local test fails, GitHub Actions will fail too.

## How it deploys

On every push to `main`, the workflow:

1. Installs dependencies with `npm ci`
2. Builds the frontend with `npm run build`
3. Uploads the generated `dist` folder to the VPS
4. Replaces `/var/www/RegistrationFormFrontend/dist`
5. Runs `nginx -t` and reloads Nginx when Nginx is available

You can also run it manually from the GitHub Actions tab using `workflow_dispatch`.
