FROM node:20-alpine AS tini_fetcher
ENV TINI_VERSION=v0.19.0
RUN wget -O - https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static > /tini && \
    chmod 755 /tini

FROM node:20-alpine
WORKDIR /app
COPY --from=tini_fetcher /tini /tini
COPY . /app
EXPOSE 3003
CMD ["node", "index.mjs"]
ENTRYPOINT ["/tini", "--"]
