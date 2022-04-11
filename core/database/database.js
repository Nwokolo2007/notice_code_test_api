const mongodb =  require('mongodb');
const mongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) =>{
    mongoClient.connect('mongodb+srv://notice:ciNxnphI6cifMjVc@cluster0.i7iis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client => {
    console.log("connected!");
    _db =  client.db();
    callback();

    }).catch(err =>{
        console.log(err);
        throw error;
    });
};

const getDb = ()=>{
    if(_db)
    {
        return _db;
    }
    throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
