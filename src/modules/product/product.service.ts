import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto, QueryDto, updateProductDto } from './dto/product.dto';
import { ProductDocument, UserDocument } from 'src/DB/models';
import { ProductRepository } from 'src/DB/Repository/product.repository';
import { FileUploadService } from 'src/common/service/fileUpload.service';
import { CategoryRepository } from 'src/DB/Repository';
import { FilterQuery, Types } from 'mongoose';
import slugify from 'slugify';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';





@Injectable()
export class ProductService {

    constructor(
        private readonly _productRepository: ProductRepository,
        private readonly _fileUploadService: FileUploadService,
        private readonly _categoryRepository: CategoryRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    // ============================= create Product ====================================
    async createProduct(body: CreateProductDto, user: UserDocument, files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }) {

        const { name, description, category, subCategory, brand, price, discount, stock, quantity } = body

        const categoryExist = await this._categoryRepository.findOne({ _id: category })
        if (!categoryExist) {
            throw new BadRequestException('Category not found')
        }

        // check subCategory
        // check brand


        if (!files.mainImage) {
            throw new BadRequestException('Main image is required')
        }
        const customId = Math.random().toString(36).substring(2, 7)

        const { secure_url, public_id } = await this._fileUploadService.uploadFile(files.mainImage[0],
            { folder: `${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/products/${customId}/mainImage` })


        let subImages: { secure_url: string, public_id: string }[] = []
        if (files.subImages) {
            const results = await this._fileUploadService.uploadFiles(files.subImages,
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/products/${customId}/subImages` })
            subImages.push(...results)
        }

        const subPrice = price - (price * ((discount || 0) / 100))


        const product = await this._productRepository.create({
            name,
            description,
            category: Types.ObjectId.createFromHexString(category),
            subCategory: Types.ObjectId.createFromHexString(subCategory),
            brand: Types.ObjectId.createFromHexString(brand),
            price,
            discount,
            subPrice,
            stock,
            quantity,
            customId,
            mainImage: { secure_url, public_id },
            subImages,
            userId: user._id
        })

        return { product }
    }

    // ============================= update Product ====================================
    async updateProduct(
        body: updateProductDto,
        user: UserDocument,
        productId: Types.ObjectId,
        files: { mainImage: Express.Multer.File[], subImages?: Express.Multer.File[] }
    ) {
        const { name, description, category, subCategory, brand, price, discount, stock, quantity } = body
        const product = await this._productRepository.findOne({ _id: productId, userId: user._id })
        if (!product) {
            throw new BadRequestException('Product not found or you are not authorized')
        }

        if (name) {
            product.name = name
            product.slug = slugify(name, { replacement: '-', lower: true, trim: true })
        }

        if (description) {
            product.description = description
        }
        // check subCategory
        // check brand

        const categoryExist = await this._categoryRepository.findOne({ _id: category })
        if (!categoryExist) {
            throw new BadRequestException('Category not found or you are not authorized')
        }


        if (files.mainImage) {
            await this._fileUploadService.deleteFile(product.mainImage["public_id"])
            const { secure_url, public_id } = await this._fileUploadService.uploadFile(files.mainImage[0],
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/products/${product.customId}/mainImage` })
            product.mainImage = { secure_url, public_id }
        }


        if (files.subImages) {
            await this._fileUploadService.deleteFolder(`${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/products/${product.customId}/subImages`)
            const results = await this._fileUploadService.uploadFiles(files.subImages,
                { folder: `${process.env.CLOUDINARY_FOLDER}/category/${categoryExist['customId']}/products/${product.customId}/subImages` })
            product.subImages = results
        }

        if (price && discount) {
            product.subPrice = price - (price * ((discount) / 100))
            product.price = price
            product.discount = discount
        } else if (price) {
            product.subPrice = price - (price * (product.discount / 100))
            product.price = price
        } else if (discount) {
            product.subPrice = product.price - (product.price * (discount / 100))
            product.discount = discount
        }

        if (stock) {
            if (stock > product.quantity) {
                throw new BadRequestException('Stock cannot be less than quantity')
            }
            product.stock = stock
        }

        if (quantity) {
            product.quantity = quantity
        }

        await product.save()


        return { product }
    }



    // ============================= get Products ====================================
    async getProducts(query: QueryDto) {

        // let filterObj: FilterQuery<ProductDocument> = {}

        // if (query?.name) {
        //     filterObj = {
        //         $or: [
        //             { name: { $regex: query.name, $options: 'i' } },
        //             { slug: { $regex: query.name, $options: 'i' } }
        //         ]
        //     }
        // }

        // const products = await this._productRepository.find({
        //     filter: filterObj,
        //     //  populate: [{ path: 'category' }] ,
        //     select: query.select,
        //     sort: query.sort,
        //     page: query.page

        // })


        const products = await this._productRepository.find({})
        // const products = await this.cacheManager.get("products") // null
        // if (!products) {
        //     await this.cacheManager.set("products", products, 5000)
           
        
        // }
            console.log("ay 7aga");

        return { products }
    }


}