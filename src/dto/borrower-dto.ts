import { IsString, IsOptional } from 'class-validator';

export class CreateBorrowerDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;
}