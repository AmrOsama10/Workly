import { DeleteResult, Model, MongooseUpdateQueryOptions, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

export class AbstractRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create(doc: Partial<T>) {
        const createdDoc = new this.model(doc);
        return createdDoc.save();
    }
    async getOne(
        filter: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ) {
        return this.model.findOne(filter, projection, options);
    }
    async getAll(
        filter?: QueryFilter<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>) {
        return this.model.find(filter, projection, options)
    }
    async update(
        filter: QueryFilter<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions<T>
    ) {
        return this.model.findOneAndUpdate(filter, update, options)
    }   
    async updateAll(filter: QueryFilter<T>, update: UpdateQuery<T>, options?: MongooseUpdateQueryOptions) {
        return this.model.updateMany(filter, update, options)
    }
    async delete(filter: QueryFilter<T>, options?: QueryOptions<T>) {
        return this.model.findOneAndDelete(filter, options);
    }
    async deleteAll(filter?: QueryFilter<T>): Promise<DeleteResult> {
        return this.model.deleteMany(filter)
    }
    
}