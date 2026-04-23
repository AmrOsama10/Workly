import { AbstractRepository } from "@models/abstract.repository";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends AbstractRepository<User> {

    constructor(@InjectModel(User.name) userModel:Model<User>) {
        super(userModel);
    }
}