FROM ghcr.io/apollographql/router:v1.57.0
# supergraph.graphql is composed by rover in CI/CD before this image is built
COPY supergraph.graphql /dist/schema/supergraph.graphql
COPY router/router.yaml /dist/config/router.yaml
