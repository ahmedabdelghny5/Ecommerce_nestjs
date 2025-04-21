import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateProductDto, QueryDto, updateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Auth, UserDecorator } from 'src/common/decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerCloudConfig } from 'src/common/utils/multerCloud';
import { ImageAllowedExtensions } from 'src/common/Constants/constants';
import { UserRoles } from 'src/common/types/types';
import { UserDocument } from 'src/DB/models';
import { Types } from 'mongoose';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService) { }


    // ============================= create Product ====================================
    @Post('create')
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 }
    ], multerCloudConfig({
        allowedExtensions: ImageAllowedExtensions
    })))
    async createProduct(
        @Body() body: CreateProductDto,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        return await this.productService.createProduct(body, user, files);
    }



    // ============================= update Product ====================================
    @Patch('update/:productId')
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 }
    ], multerCloudConfig({
        allowedExtensions: ImageAllowedExtensions
    })))
    async updateProduct(
        @Body() body: updateProductDto,
        @Param("productId") productId: Types.ObjectId,
        @UserDecorator() user: UserDocument,
        @UploadedFiles() files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        return await this.productService.updateProduct(body, user, productId, files);
    }


 

    // ============================= get Products ====================================
    @Get("list")
    @UsePipes(new ValidationPipe({}))
    @UseInterceptors(CacheInterceptor)
    async getProducts(@Query() query: QueryDto) {
        return await this.productService.getProducts(query);
    }

}
