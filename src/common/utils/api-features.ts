import { PopulateOptions } from "mongoose";

// utils/api-features.ts
export class APIFeatures<T> {
    constructor(
        private query: any, // Mongoose query object
        private queryString: Record<string, any>
    ) { }

    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludeFields.forEach((el) => delete queryObj[el]);

        // Advanced filtering (gt, gte, lt, lte)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|regex)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    search() {
        if (this.queryString.search) {
            const searchRegex = { $regex: this.queryString.search, $options: 'i' };
            this.query = this.query.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex }
                ]
            });
        }
        return this;
    }


    getQuery() {
        return this.query;
    }
}

