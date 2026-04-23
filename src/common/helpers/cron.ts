import { CompanyRepository, UserRepository } from '@models/index';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly companyRepository: CompanyRepository,
    ) { }

    @Cron('0 */6 * * *')
    async deleteExpiredOtp() {
        const now = new Date();
        await this.userRepository.updateAll(
            { otpExpireAt: { $lt: now } },
            {
                $unset: {
                    otp: '',
                    otpExpireAt: '',
                },
            },
        );
    }

    @Cron('0 0 0 1 * *')
    async deleteUsers() {
        await this.userRepository.deleteAll({ deletedAt: { $ne: null } })
    }

    @Cron('0 */6 * * *')
    async deleteCompanies() {
        await this.companyRepository.deleteAll({ deletedAt: { $ne: null } })
    }
}
