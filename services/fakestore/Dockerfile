# Build from the repository root:
# docker build -f services/fakestore/Dockerfile -t fakestore .
FROM node:26-alpine
WORKDIR /app
COPY services/fakestore/server.mjs services/fakestore/server.mjs
COPY src/modules/catalog/infrastructure/fixtures src/modules/catalog/infrastructure/fixtures
ENV PORT=4010
EXPOSE 4010
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4010)+'/health').then((response)=>process.exit(response.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "services/fakestore/server.mjs"]
