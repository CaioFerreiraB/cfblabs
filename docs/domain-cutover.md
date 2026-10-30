# Custom domain cutover

GitHub Pages is configured for `cfblabs.com.br`, and the build targets the domain root. Before DNS changes, the Cloudflare zone sends the apex domain to `137.131.32.141`, and `www` is a CNAME to the apex.

## Cutover sequence

1. In GitHub Pages settings, verify ownership of `cfblabs.com.br` if GitHub offers a TXT challenge. Add the exact TXT record shown by GitHub in Cloudflare and wait for verification.
2. Confirm that the custom domain of `CaioFerreiraB/cfblabs` remains `cfblabs.com.br` and that the publishing source remains GitHub Actions.
3. In Cloudflare DNS, replace only the apex (`@`) A record pointing to `137.131.32.141` with these four GitHub Pages A records, with proxy status **DNS only** and TTL **Auto**:

   ```text
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. Change the `www` CNAME target from `cfblabs.com.br` to `caioferreirab.github.io`, also **DNS only** with TTL **Auto**. Do not include `https://` or `/cfblabs` in the target.
5. Leave the explicit `vault` and `portainer` records unchanged. The existing wildcard A record (`*`) can stay on the former server during cutover; review whether it is still needed afterward.
6. Enable **Enforce HTTPS** in GitHub Pages when available. Check the apex domain, the `www` redirect, all eight routes, CSS, images, and the language switch over HTTPS.

GitHub Pages custom-domain settings, rather than a `CNAME` file in the source repository, control the domain for this GitHub Actions deployment. DNS propagation and certificate issuance may take time. If the cutover must be reversed, restore the prior apex A record and `www` CNAME, remove the custom domain from GitHub Pages, and restore the temporary URL build settings.
