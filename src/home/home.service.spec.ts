import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { homeSelect } from './home.service';
import { NotFoundException } from '@nestjs/common/exceptions';

const mockGetHomes = [
  {
    id: 21,
    address: "Orchid Str",
    city: "Davao",
    price: 500000,
    propertyType: "CONDO",
    image: 'img1',
    numberOfBedrooms: 5,
    numberOfBathrooms: 5,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

const mockHome = [
  {
    id: 21,
    address: "Orchid Str",
    city: "Davao",
    price: 500000,
    property_type: "CONDO",
    image: 'img1',
    number_of_bedrooms: 5,
    number_of_bathrooms: 5,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

const mockImages = [
  {
    id: 1,
    url: "src1"
  },
];

// describe() = Groups similar tests together
describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService; // Allows us to spy on this method

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService, 
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue([mockGetHomes]),
              create: jest.fn().mockReturnValue([mockHome])
            },
            image: {
              createMany: jest.fn().mockReturnValue([mockImages]),
            }
          }
        }
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe("getHomes", () => {

    const filters = {
      city: "Davao",
      price: {
        gte: 1000000,
        lte: 1500000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    }

    // it() = Defines a specific test
    it("should call prisma home.findMany with correct params", async () => {
      // We don't want any actual db transactions, we just return a mock of what we get back
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes)

      jest
        .spyOn(prismaService.home, "findMany")
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters)

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1
          },
        },
        where: filters,
      });
    });

    it("should throw not found exception if homes are found", async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest  
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await expect(service.getHomes(filters)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createHome', () => {
    const mockCreateHomeParams = {
      address: "Dalhia Street",
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: "Manila",
      landSize: 4444,
      price: 3000000,
      propertyType: PropertyType.RESIDENTIAL,
      images: [{
        url: "src1"
      }],
    }

    it("should call prisma home.create with the correct payload", async () => {
      const mockCreateHome = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, "create")
        .mockImplementation(mockCreateHome)

      await service.createHome(mockCreateHomeParams, 5);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address: "Dalhia Street",
          number_of_bathrooms: 2,
          number_of_bedrooms: 2,
          city: "Manila",
          land_size: 4444,
          propertyType: PropertyType.RESIDENTIAL,
          price: 3000000,
          realtor_id: 5,
        },
      });
    });

    it("should call prisma image.createMany with the correct payload", async () => {
      const mockCreateManyImages = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, "createMany")
        .mockImplementation(mockCreateManyImages)

      await service.createHome(mockCreateHomeParams, 5);

      expect(mockCreateManyImages).toBeCalledWith({
        data:
        [{
          url: "src1",
        }]
      });
    });
  });
});
