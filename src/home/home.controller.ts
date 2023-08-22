import { Controller, Get, Post, Put, Delete, Query, Body, Param, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto, InquireDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from "@prisma/client";

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

  @Roles( UserType.REALTOR )
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo){
    return this.homeService.createHome(body, user.id);
  }

  @Roles( UserType.REALTOR )
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body:UpdateHomeDto,
    @User() user: UserInfo
  ){
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if(realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHomeById(id, body);
  }

  @Roles( UserType.REALTOR )
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }

  @Roles( UserType.BUYER )
  @Post('/:id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() {message}: InquireDto
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

}

//REALTOR
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVhbHRvciIsImlkIjoxMSwiaWF0IjoxNjkyMzQ5MTUwLCJleHAiOjE2OTU5NDkxNTB9.4ggzIqTxDJI_nZvKFm61nxdG7k3QoTzXjT7G2AygMtM

//BUYER
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQnV5ZXIiLCJpZCI6MTAsImlhdCI6MTY5MjM0OTI0NiwiZXhwIjoxNjk1OTQ5MjQ2fQ.vO7d66mxzg2CxXwQyIq9yX_zJBQRrHJlWKmGhCRVCwg