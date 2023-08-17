import { Controller, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService:HomeService){}

  @Get()
  getHomes(
    // Optional values that can be appended to the path
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {

    const price = minPrice || maxPrice ? {
      ...(minPrice && {gte: parseFloat(minPrice)}),
      ...(maxPrice && {gte: parseFloat(maxPrice)}),
    } : undefined

    const filters = {
      // If city is defined, it will be destructured into an object
      ...(city && {city}),
      ...(price && {price}),
      ...(propertyType && {propertyType}),
    }
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHome(){
    return {}
  }

  @Post()
  createHome(){
    return {}
  }

  @Put(':id')
  updateHome(){
    return {}
  }

  @Delete(':id')
  deleteHome(){}
}
