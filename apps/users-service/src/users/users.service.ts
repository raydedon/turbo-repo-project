import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User } from "./dto/user.type";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        website: true,
        address: {
          select: {
            street: true,
            suite: true,
            city: true,
            zipcode: true,
            lat: true,
            lng: true,
          },
        },
        company: { select: { name: true, catchPhrase: true, bs: true } },
      },
    });
    return users.map(this.mapUser);
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        website: true,
        address: {
          select: {
            street: true,
            suite: true,
            city: true,
            zipcode: true,
            lat: true,
            lng: true,
          },
        },
        company: { select: { name: true, catchPhrase: true, bs: true } },
      },
    });
    return user ? this.mapUser(user) : null;
  }

  // Batch fetch — used by DataLoader to resolve multiple entity references in one DB query
  async findByIds(ids: number[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        website: true,
        address: {
          select: {
            street: true,
            suite: true,
            city: true,
            zipcode: true,
            lat: true,
            lng: true,
          },
        },
        company: { select: { name: true, catchPhrase: true, bs: true } },
      },
    });
    return users.map(this.mapUser);
  }

  private mapUser(u: any): User {
    return {
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone,
      website: u.website,
      address: u.address
        ? {
            street: u.address.street,
            suite: u.address.suite,
            city: u.address.city,
            zipcode: u.address.zipcode,
            geo: { lat: u.address.lat, lng: u.address.lng },
          }
        : null,
      company: u.company
        ? {
            name: u.company.name,
            catchPhrase: u.company.catchPhrase,
            bs: u.company.bs,
          }
        : null,
    };
  }
}
