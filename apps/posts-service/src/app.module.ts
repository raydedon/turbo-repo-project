import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { PostsModule } from "./posts/posts.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        path: join(process.cwd(), "src/schema.gql"),
        federation: 2,
      },
      playground: false,
      introspection: true,
    }),
    PostsModule,
    HealthModule,
  ],
})
export class AppModule {}
