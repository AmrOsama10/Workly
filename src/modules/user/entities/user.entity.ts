import { Gender, Provider, Role } from "@common/enum"

export class User {
    _id: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    password: string
    mobileNumber: string
    role: Role
    dob: string
    gender: Gender
    isVerified: boolean
    provider: Provider
    profilePicture: string
    profileCoverPicture: string
}
