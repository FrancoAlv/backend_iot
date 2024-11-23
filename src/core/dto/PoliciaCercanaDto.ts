import { IsNumber, IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';

export class PoliciaCercanaDto {
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @IsNumber()
  radius: number;
}
