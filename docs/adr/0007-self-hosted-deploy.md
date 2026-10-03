# ADR 0007: Despliegue self-hosted y caché

## Contexto

La entrega principal es Dokploy sobre Proxmox, publicado con Cloudflare Tunnel en `csti-challenge.orlando-rojas.com`. Vercel es un espejo de producción, no el origen.

## Decisión

Build once, deploy many. `release.yml` construye la imagen standalone, corre Playwright y Lighthouse, y la publica en GHCR por SHA. Dokploy la redespliega con un webhook. El espejo sale de `vercel deploy --prebuilt --prod`, con la integración de Git apagada.

`NEXT_PUBLIC_SITE_URL` apunta siempre al dominio principal. En el espejo, `SITE_INDEXABLE=false` agrega `noindex`.

Cloudflare cachea `/_next/static/*` un año y respeta el origen en `/_next/image*`. El HTML no se cachea en el borde: lo decide Next. HSTS y Brotli quedan en el dashboard de Cloudflare. SSL del túnel en Full (strict).

La caché de datos es memoria y el volumen `.next/cache` de la única instancia. No hay Valkey.

## Rollback

En Dokploy, redesplegar el tag `ghcr.io/<repo>:<sha>` anterior. El SHA está en GHCR y en el workflow.

## Consecuencias

Sin el webhook y sin el túnel, el workflow publica la imagen y no puede completar el smoke del dominio. Esos secretos viven en GitHub: `DOKPLOY_WEBHOOK_URL`, `DOKPLOY_STORYBOOK_WEBHOOK_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Storybook estático va en `csti-challenge-storybook.orlando-rojas.com` (un solo nivel: Universal SSL no cubre dos).
