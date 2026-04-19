import { Injectable, Scope } from "@nestjs/common";
import DataLoader from "dataloader";
import { UsersService } from "./users.service";
import { User } from "./dto/user.type";

/**
 * REQUEST-scoped DataLoader — a fresh instance is created per GraphQL request.
 * This prevents cross-request cache pollution and correctly batches all
 * __resolveReference calls for User entities within a single request.
 *
 * N+1 solution: Apollo Router sends a single _entities query with all referenced
 * user IDs at once. Each __resolveReference call queues a load(); DataLoader
 * collects them all and fires ONE prisma.user.findMany({ where: { id: { in: ids } } })
 * instead of N individual queries.
 */
@Injectable({ scope: Scope.REQUEST })
export class UsersDataLoader {
  private readonly loader: DataLoader<number, User | null>;

  constructor(private readonly usersService: UsersService) {
    this.loader = new DataLoader<number, User | null>(
      async (ids: readonly number[]) => {
        const users = await this.usersService.findByIds([...ids]);
        const userMap = new Map(users.map((u) => [u.id, u]));
        return ids.map((id) => userMap.get(id) ?? null);
      },
      { cache: true }, // cache within this request
    );
  }

  load(id: number): Promise<User | null> {
    return this.loader.load(id);
  }

  loadMany(ids: number[]): Promise<(User | null | Error)[]> {
    return this.loader.loadMany(ids);
  }
}
