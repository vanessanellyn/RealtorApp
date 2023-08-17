import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  }
  propertyType?: PropertyType
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService){}

  async getHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      // Gets the data and image needed for display
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          // Gets only 1 photo
          take: 1
        },
      },
      // Filters the path of the endpoint
      where: filter
    });

    if (!homes.length) throw new NotFoundException();
    return homes.map (
      home => {
        const fetchHome = { ...home, image: home.images[0].url }
        delete fetchHome.images
        return new HomeResponseDto(fetchHome)
      },
    );
  }
}
