import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from 'src/DB/Repository';
import { CategoryModel } from 'src/DB/models';
import { FileUploadService } from 'src/common/service/fileUpload.service';

@Module({
  imports: [ CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository,FileUploadService]
})
export class CategoryModule { }
