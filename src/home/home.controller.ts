import { Controller, Get, Post, Put, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';

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
  getHome(@Param('id', ParseIntPipe) id: number){
    return this.homeService.getHomeById(id);
  }

  
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo){
    return this.homeService.createHome(body, user.id);
  }

  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id:number,
    @Body() body:UpdateHomeDto,
  ){
    return this.homeService.updateHomeById(id, body);
  }

  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number){
    return this.homeService.deleteHomeById(id);
  }
}
