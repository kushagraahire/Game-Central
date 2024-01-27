import mongoose from "mongoose";



const gameSchema = new mongoose.Schema({
    title: String,
    genre: String,
    gameDescription: String,
    price: Number,
    releaseDate: String,
    recSystemRequirements: {},
    minSystemRequirements: {},
    downloadLink: String,
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" },
    languageSupport: [String],
    ageRating: String,
    coverPhoto: String,
    snapshots: [String]
})

const publisherSchema = new mongoose.Schema({
    publisherEmail: String,
    publisherPassword: String,
    publisherUsername: String,
    publisherDescription: String,
    publisherProfilePicture: String,
    publishedGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }]
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    profilePicture: String,
    myGames: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    cart: {items : [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }], totalAmount : Number}
})


const User = mongoose.model('User', userSchema);
const Game = mongoose.model('Game', gameSchema);
const Publisher = mongoose.model('Publisher', publisherSchema);

export { User, Game, Publisher };