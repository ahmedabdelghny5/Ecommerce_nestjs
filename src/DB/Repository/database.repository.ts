import { FilterQuery, Model, PopulateOptions, Types } from "mongoose";


interface FindOptions<TDocument> {
    filter?: FilterQuery<TDocument>,
    populate?: PopulateOptions[],
    select?: string,
    sort?: string,
    page?: number,

}

export abstract class DataBaseRepository<TDocument> {
    constructor(private readonly model: Model<TDocument>) { }

    async create(data: Partial<TDocument>): Promise<TDocument> {
        return this.model.create(data)
    }

    async findOne(filter: FilterQuery<TDocument>, populate?: PopulateOptions[]): Promise<TDocument | null> {
        return this.model.findOne(filter).populate(populate || [])
    }

    async find({ filter = {}, populate = [], sort = '', select = '', page = 1 }: FindOptions<TDocument>): Promise<TDocument[] | []> {
        const query = this.model.find(filter)
        if (populate) query.populate(populate)
        if (select) query.select(select.replaceAll(',', ' '))
        if (sort) query.sort(sort.replaceAll(',', ' '))

        if (!page) {
            return await query
        }

        let limit = 2
        let skip = (page - 1) * limit

        return await query.limit(limit).skip(skip)


    }


    async findById(id: Types.ObjectId): Promise<TDocument | null> {
        return this.model.findById(id)
    }


    async findOneAndUpdate(query: FilterQuery<TDocument>, data: Partial<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndUpdate(query, data, { new: true })
    }

    async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument | null> {
        return this.model.findOneAndDelete(query)
    }
}