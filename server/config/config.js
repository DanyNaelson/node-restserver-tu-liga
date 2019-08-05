//========================================
// Port
//========================================
process.env.PORT = process.env.PORT || 3000;

//========================================
// Entorno
//========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================================
// Expiration token
//========================================
// 60 seconds
// 60 minutes
// 24 hours
// 7 days
process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 7

//========================================
// Authentication SEED
//========================================
process.env.SEED = process.env.SEED || 'seed_tu_liga'

//========================================
// Database
//========================================
process.env.MONGODB_URI = process.env.MONGODB_URI