import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto, updateCategoryDto } from './dto/category.dto';
import { UserDocument } from 'src/DB/models';
import { CategoryRepository } from 'src/DB/Repository';
import { Express } from 'express';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { Types } from 'mongoose';
import slugify from 'slugify';
@Injectable()
export class CategoryService {
    constructor(
        private readonly _categoryRepository: CategoryRepository,
        private readonly _fileUploadService: FileUploadService
    ) { }

    //========================== create category ====================================
    async createCategory(body: CreateCategoryDto, user: UserDocument, file?: Express.Multer.File) {
        const { name } = body
        const categoryExist = await this._categoryRepository.findOne({ name: name.toLowerCase() })
        if (categoryExist) {
            throw new BadRequestException('Category already exists')
        }
        let dummyData = {
            name,
            userId: user._id
        }
        const customId = Math.random().toString(36).substring(2, 7)
        if (file) {
            const { secure_url, public_id } = await this._fileUploadService.uploadFile(file,
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${customId}` })
            dummyData['image'] = { secure_url, public_id }
            dummyData['customId'] = customId
        }

        const category = await this._categoryRepository.create(dummyData)
        return { category };
    }

    //========================== update category ====================================
    async updateCategory(body: updateCategoryDto, user: UserDocument, id: Types.ObjectId, file?: Express.Multer.File,) {

        // if (!body) {
        //     throw new BadRequestException('Request body is missing or not properly formatted');
        //   }
        // const { name } = body

        const category = await this._categoryRepository.findOne({ _id: id, userId: user._id })
        if (!category) {
            throw new BadRequestException('Category not found or you are not authorized')
        }

        if (body?.name) {
            if (await this._categoryRepository.findOne({ name: body.name.toLowerCase() })) {
                throw new BadRequestException('Category already exists')
            }
            category.name = body.name
            category.slug = slugify(body.name, { replacement: '-', lower: true, trim: true })
        }

        if (file) {
            await this._fileUploadService.deleteFile(category.image["public_id"])
            const { secure_url, public_id } = await this._fileUploadService.uploadFile(file,
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${category.customId}` })
            category.image = { secure_url, public_id }
        }

        await category.save()
        return { category }

    }
    //========================== delete category ====================================
    async deleteCategory(user: UserDocument, file: Express.Multer.File, id: Types.ObjectId) {

        const category = await this._categoryRepository.findOneAndDelete({ _id: id, userId: user._id })
        if (!category) {
            throw new BadRequestException('Category not found or you are not authorized')
        }

        if (category.image) {
            await this._fileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/category/${category.customId}`)
        }


        // delete category subcategories
        // delete category brands
        // delete category products
        return { message: "done" }

    }

}
