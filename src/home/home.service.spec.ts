import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { homeSelect } from './home.service';

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
              findMany: jest.fn().mockReturnValue([mockGetHomes])
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

    it("should call prisma home.findMany with correct params", async () => {
      // We don't want any actual db transactions, we just return a mock of what we get back
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes)

      jest.spyOn(prismaService.home, "findMany").mockImplementation(mockPrismaFindManyHomes);

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
      })
    })
  })
  // it() = Defines a specific test
  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });
});
