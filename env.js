/* eslint-disable camelcase */
const env_dev = {
  MONGO_DB_STRING:
    'mongodb+srv://admin:y8o21HpZR0jhMhKL@shopper.ugxya.mongodb.net/test',
  jwtKey: 'jwt_secret',
  refreshKey: 'refresh_secret',
  tokenValidity: 60 * 20,
  fakeStoreUrl: "https://fakestoreapi.com/products",
  itbooksUrl: "https://api.itbook.store/1.0/new"
}

exports.env = env_dev
