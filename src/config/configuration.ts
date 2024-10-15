import * as process from "node:process";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  api_key:process.env.APIKEYOPENAI,
  CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET
});