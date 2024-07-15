import bookSchema from "./bookModel";
import categorySchema from "./categoryModel";
import userSchema from "./userModel";

const mongoose = require('mongoose');
var uri = 'mongodb://peter:peter@ac-lrfydim-shard-00-00.vxxxlod.mongodb.net:27017,ac-lrfydim-shard-00-01.vxxxlod.mongodb.net:27017,ac-lrfydim-shard-00-02.vxxxlod.mongodb.net:27017/?replicaSet=atlas-g2ts0w-shard-0&ssl=true&authSource=admin&appName=Cluster0';

async function main() {
    mongoose.connect(uri);
}

main().then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
})

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Category = mongoose.model('Category', categorySchema);
export { User, Book, Category };