import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepository } from 'src/DB/Repository';
import { createCouponDto } from './dto/coupon.dto';
import { UserDocument } from 'src/DB/models';

@Injectable()
export class CouponService {

    constructor(
        private readonly couponRepository: CouponRepository,
    ) { }

    async createCoupon(body: createCouponDto, user: UserDocument) {
        const { code, amount, fromDate, toDate } = body
        const couponExist = await this.couponRepository.findOne({ code })
        if (couponExist) {
            throw new BadRequestException("coupon already exist")
        }
        return this.couponRepository.create({ code, amount, fromDate, toDate, userId: user._id });
    }
}
