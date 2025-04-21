import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { TokenService } from "src/common/service/token";
import { OTPRepositoryService, UserRepository} from "src/DB/Repository";
import { confirmEmailDto, SignUpDto } from "./DTO/user.dto";
import { CompareHash, Hash } from "src/common/security/Hash";
import { OTPTypes } from "src/common/types/types";
import { sendEmail } from "src/common/utils/sendEmail";



@Injectable()
export class UserService {
    constructor(
        private readonly UserRepository: UserRepository,
        private readonly TokenService: TokenService,
        private readonly OTPRepositoryService: OTPRepositoryService
    ) { }

    // ===================================================  signup ==================================== 
    async signup(body: SignUpDto) {
        try {
            const { name, email, password, DOB, phone, address, gender, role } = body
            const userExist = await this.UserRepository.findOne({ email })
            if (userExist) {
                throw new ConflictException("user already exist")
            }

            const user = await this.UserRepository.create({
                name,
                email,
                password,
                DOB,
                phone,
                address,
                gender,
                role
            })
            const code = Math.floor(Math.random() * (21564 + 841) - 82).toString()
            this.OTPRepositoryService.createOtp({
                userId: user._id,
                otp: Hash(code),
                otpTypes: OTPTypes.confirmation
            })
            await sendEmail({ to: email, subject: "otp", html: `<h1>code:${code}</h1>` })
            return { user }
        } catch (error) {
            throw new InternalServerErrorException(error)

        }
    }

    // ===================================================  confirmEmail ==================================== 
    async confirmEmail(body: confirmEmailDto) {
        try {
            const { email, otp } = body
            const user = await this.UserRepository.findOne({ email, confirmed: { $exists: false } })
            if (!user) {
                throw new NotFoundException("user not exist or already confirmed")
            }
            const otpExist = await this.OTPRepositoryService.findOne({ userId: user._id, otpTypes: OTPTypes.confirmation })
            if (!otpExist) {
                throw new ForbiddenException("otp not exist")
            }

            if (!CompareHash(otp, otpExist.otp)) {
                throw new ForbiddenException("otp is incorrect")
            }
            if (new Date() > otpExist.expireAt) {
                throw new BadRequestException("otp is expired")
            }
            await this.UserRepository.findOneAndUpdate({ _id: user._id }, { confirmed: true })
            await this.OTPRepositoryService.findOneAndDelete({ _id: otpExist._id })
            return { message: "Done" }

        } catch (error) {
            throw new InternalServerErrorException(error)

        }
    }

    // ===================================================  signin ==================================== 
    async signin(body: any) {
        try {
            const { email, password } = body
            const user = await this.UserRepository.findOne({ email, confirmed: true })
            if (!user) {
                throw new NotFoundException("user not exist or not confirmed")
            }
            if (!CompareHash(password, user.password)) {
                throw new BadRequestException("InValid Password")
            }
            const access_token = this.TokenService.generateToken({ email, id: user["id"] },
                { secret: process.env.JWT_SECRET, expiresIn: "1w" })
            const refresh_token = this.TokenService.generateToken({ email, id: user["id"] },
                { secret: process.env.JWT_SECRET, expiresIn: "1y" })

            return { access_token, refresh_token }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}