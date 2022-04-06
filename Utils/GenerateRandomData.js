function generateRandomQuantity(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomRating() {
    var rating = {
        rate: Math.floor((Math.random() * 5)),
        count: Math.floor((Math.random() * 250))
    }
    return rating
}

module.exports = {
    generateRandomQuantity: generateRandomQuantity,
    generateRandomRating: generateRandomRating
}