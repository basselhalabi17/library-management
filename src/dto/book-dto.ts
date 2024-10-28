import { IsString, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;


  @IsInt()
  quantity: number;

  @IsString()
  shelfLocation: string;
}
