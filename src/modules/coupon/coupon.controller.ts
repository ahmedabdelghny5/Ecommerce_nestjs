import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { createCouponDto } from './dto/coupon.dto';
import { Auth, UserDecorator } from 'src/common/decorator';
import { UserRoles } from 'src/common/types/types';
import { UserDocument } from 'src/DB/models';

@Controller('coupon')
export class CouponController {

    constructor(private readonly couponService: CouponService) { }

    // ============create coupon===============================
    @Post()
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async create(@Body() body: createCouponDto, @UserDecorator() user: UserDocument) {
        return this.couponService.createCoupon(body,user);
    }


}
