import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { UsersModule } from "./users/users.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      // Code-first: auto-generate schema file and enable Federation v2
      autoSchemaFile: {
        path: join(process.cwd(), "src/schema.gql"),
        federation: 2,
      },
      // Expose Apollo Sandbox in dev
      playground: false,
      introspection: true,
    }),
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
