import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  id: 53, 
  name: "Laith",
  email: "example@email.com",
  phone: "555 555 5555"
}

const mockHome = [
  {
    id: 21,
    address: "Orchid Str",
    city: "Davao",
    price: 500000,
    property_type: PropertyType.CONDO,
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

describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [{
        provide: HomeService,
        useValue: {
          getHomes: jest.fn().mockReturnValue([]),
          getRealtorByHomeId: jest.fn().mockReturnValue(mockUser),
          updateHomeById: jest.fn().mockReturnValue(mockHome) // This is so we don't touch out database
        }
      }, PrismaService],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe("getHomes", () => {
    it("should constuct filter object correctly", async () => {
      const mockGetHomes = jest.fn().mockReturnValue([])

      jest.spyOn(homeService, "getHomes").mockImplementation(mockGetHomes);

      await controller.getHomes("Toronto", "1500000");

      expect(mockGetHomes).toBeCalledWith({
        city: "Toronto",
        price: {
          gte: 1500000,
        }
      });
    });
  });

  describe("updateHome", () => {
    
    const mockUserInfo = {
      name: "John Doe",
      id: 30,
      iat: 1, 
      exp: 2
    }

    const mockUpdateHomeParams = {
      address: "Dalhia Street",
      numberOfBathrooms: 2,
      numberOfBedrooms: 2,
      city: "Manila",
      landSize: 4444,
      price: 3000000,
      propertyType: PropertyType.RESIDENTIAL,
    }

    it("should throw unauth error if realtor didn't create home", async () => {
      await expect(
        controller.updateHome(5, mockUpdateHomeParams, mockUserInfo)
        ).rejects.toThrowError(UnauthorizedException);
    });

    it("should update home if realtor id is valid", async () => {
      const mockUpdateHome = jest.fn().mockReturnValue(mockHome)

      jest.spyOn(homeService, "updateHomeById").mockImplementation(mockUpdateHome)

      await controller.updateHome(5, mockUpdateHomeParams, mockUserInfo)
    })
  });
});
