

class APIFeatures{
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    search()  {
        const keyword = this.queryStr.keyword ? { 
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        // console.log(keyword)
        this.query = this.query.find({ ...keyword })

        return this
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        //Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page']
        //Loop through the keys and delete any of the listen above from the query object
        removeFields.forEach( el=> delete queryCopy[el]);

        // console.log('QueryCopy Remains',queryCopy)

        //Advanced filter fro price and ratings etc
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        
        console.log('queryStr',queryStr);


        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);

        return this
    }
}

module.exports = APIFeatures