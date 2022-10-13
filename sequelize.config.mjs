import dotenv from 'dotenv'

// Load env variables
dotenv.config()
const { DATABASE_URL } = process.env

export default {
  "development": {
    "url": DATABASE_URL,
    "dialect": "postgres"
  },
  "staging": {
    "url": DATABASE_URL,
    "dialect": "postgres",
    "ssl":true,
    "dialectOptions":{
      "ssl":{
        "require":true,
        "rejectUnauthorized": false
      }
    }
  },
  "production": {
    "url": DATABASE_URL,
    "dialect": "postgres",
    "ssl":true,
    "dialectOptions":{
      "ssl":{
        "require":true,
        "rejectUnauthorized": false
      }
    }
  }
}
