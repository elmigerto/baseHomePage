# Deployment Tasks

## Frontend Deployment
- [x] Deploy frontend (Vite) to GitHub Pages
- [ ] Connect to backend Stripe API from frontend
- [ ] Use custom domain (optional)

### GitHub Pages
The repository includes a workflow at `.github/workflows/deploy.yml` which
builds the React app and publishes the contents of `tobis-space/dist` to the
`gh-pages` branch. The build sets the `GITHUB_PAGES` environment variable so
Vite uses the correct base path.

Steps to enable GitHub Pages:

1. Push the `work` branch to GitHub.
2. In the repository settings, enable Pages and select the `GitHub Actions`
   source.
3. After the workflow runs, your site will be available at
   `https://<username>.github.io/baseHomePage/`.
