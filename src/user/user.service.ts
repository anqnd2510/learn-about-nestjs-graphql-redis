import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto, UserFilter } from './dto/user.dto';
import { UserPaginationResponse } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(dataUser: any): Promise<User> {
    return await this.prisma.user.create({ data: dataUser });
  }
  async findAll(filter: UserFilter): Promise<UserPaginationResponse> {
    const search = filter.search || '';
    const itemsPerPage = Number(filter.itemsPerPage) || 10;
    const page = Number(filter.page) || 1;

    const skip = page > 1 ? (page - 1) * itemsPerPage : 0;
    const users = await this.prisma.user.findMany({
      take: itemsPerPage,
      skip: skip,
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
    });
    const total = await this.prisma.user.count({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
    });
    return {
      data: users,
      total,
      currentPage: page,
      itemsPerPage,
    };
  }
  async findOne(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async update(id: number, dataUpdate: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: dataUpdate,
    });
  }
  async delete(id: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
