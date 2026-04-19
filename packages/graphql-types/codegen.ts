import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * Generates TypeScript types from the composed supergraph schema.
 * Run `npm run codegen` after the supergraph is composed with rover.
 *
 * Prerequisites:
 *   1. All three subgraph services must be running
 *   2. Run: rover supergraph compose --config ../../supergraph.yaml > ../../dist/schema/supergraph.graphql
 *   3. Then: npm run codegen
 */
const config: CodegenConfig = {
  schema: '../../dist/schema/supergraph.graphql',
  documents: ['../../apps/blogs/lib/**/*.ts', '../../apps/users/lib/**/*.ts'],
  generates: {
    './src/generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        strictScalars: true,
        scalars: {
          ID: 'string',
        },
        enumsAsTypes: true,
        avoidOptionals: false,
      },
    },
  },
};

export default config;
