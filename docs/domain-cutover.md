# Custom domain cutover

The temporary site is published at `https://caioferreirab.github.io/cfblabs/`. Keep it available until the portfolio has been reviewed. The Cloudflare zone currently sends the apex domain to `137.131.32.141`, and `www` is a CNAME to the apex.

## Cutover sequence

1. In GitHub Pages settings, verify ownership of `cfblabs.com.br` if GitHub offers a TXT challenge. Add the exact TXT record shown by GitHub in Cloudflare and wait for verification.
2. Set the custom domain of `CaioFerreiraB/cfblabs` to `cfblabs.com.br` in GitHub Pages settings. The publishing source must remain GitHub Actions.
3. In Cloudflare DNS, replace only the apex (`@`) A record pointing to `137.131.32.141` with these four GitHub Pages A records, with proxy status **DNS only**:

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. Change the `www` CNAME target to `caioferreirab.github.io`, also **DNS only**. Leave unrelated subdomains and other DNS records unchanged.
5. In `.github/workflows/deploy.yml`, set `SITE_URL` to `https://cfblabs.com.br` and `BASE_PATH` to `/`, then push the change and wait for the workflow to deploy.
6. Enable **Enforce HTTPS** in GitHub Pages when available. Check the apex domain, the `www` redirect, all eight routes, CSS, images, and the language switch over HTTPS.

GitHub Pages custom-domain settings, rather than a `CNAME` file in the source repository, control the domain for this GitHub Actions deployment. DNS propagation and certificate issuance may take time. If the cutover must be reversed, restore the prior apex A record and `www` CNAME, remove the custom domain from GitHub Pages, and restore the temporary URL build settings.
