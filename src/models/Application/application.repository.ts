import { AbstractRepository } from "@models/abstract.repository";
import { Application } from "./application.schema.js";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ApplicationRepository extends AbstractRepository<Application> {
    constructor(@InjectModel(Application.name) private readonly applicationModel:Model<Application> ) {
        super(applicationModel);
    }
}
