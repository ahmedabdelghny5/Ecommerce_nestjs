import { Body, Controller, Delete, Param, Patch, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/common/decorator/auth.decorator';
import { UserRoles } from 'src/common/types/types';
import { CreateCategoryDto, updateCategoryDto } from './dto/category.dto';
import { UserDocument } from 'src/DB/models';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageAllowedExtensions } from 'src/common/Constants/constants';
import { multerCloudConfig } from 'src/common/utils/multerCloud';
import { Types } from 'mongoose';


@Controller('category')
export class CategoryController {
    constructor(private readonly _categoryService: CategoryService) { }

    // ============================= create category ====================================
    @Post('create')
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('mainImage', multerCloudConfig({
        allowedExtensions: ImageAllowedExtensions
    })))
    async createCategory(
        @Body() body: CreateCategoryDto,
        @UserDecorator() user: UserDocument,
        @UploadedFile() file?: Express.Multer.File
    ) {
        // console.log(body, user, file);
        return this._categoryService.createCategory(body, user, file);
    }

    // ============================= update category ====================================
    @Patch('update/:id')
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('mainImage', multerCloudConfig({
        allowedExtensions: ImageAllowedExtensions
    })))
    async updateCategory(
        @Body() body: updateCategoryDto,
        @Param('id') id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() file?: Express.Multer.File
    ) {
        console.log(body, user, file);
        return this._categoryService.updateCategory(body, user, id, file);
    }

    // ============================= delete category ====================================
    @Delete('delete/:id')
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileInterceptor('mainImage', multerCloudConfig({
        allowedExtensions: ImageAllowedExtensions
    })))
    async deleteCategory(
        @Param('id') id: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this._categoryService.deleteCategory(user, file, id);
    }

}
