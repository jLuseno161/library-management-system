import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn: string;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsInt()
  @Min(1)
  genreId: number;
}