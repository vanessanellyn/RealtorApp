import { PropertyType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";


export class HomeResponseDto {
  id: number;
  address: string;
  city: string;
  price: number;
  image: string;
  propertyType: PropertyType;


  @Exclude()
  number_of_bedrooms: number;

  @Expose({name: "numberOfBedrooms"})
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }


  @Exclude()
  number_of_bathrooms: number;

  @Expose({name: "numberOfBathrooms"})
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }


  @Exclude()
  listed_date: Date;

  @Expose({name: "listedDate"})
  listedDate() {
    return this.listed_date;
  }


  @Exclude()
  land_size: number;

  @Expose({name: "landSize"})
  landSize() {
    return this.land_size;
  }

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  realtor_id: number;
  
  constructor(partial: Partial<HomeResponseDto>){
    Object.assign(this, partial);
  }
}