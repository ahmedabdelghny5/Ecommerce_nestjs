import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import { diskStorage } from "multer"
import { Express } from "express"

interface MulterOptions {
    allowedExtensions: string[]
}


export const multerCloudConfig = ({ allowedExtensions }: MulterOptions) => {

    const storage = diskStorage({ })
    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (!allowedExtensions.includes(file.mimetype)) {
            return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
    }

    return { storage, fileFilter }

}