import { config } from 'dotenv'
config();
// Access environment variables
export default {
    APP: {
        PORT: Number(process.env.PORT) || 4000
    },
    DB: {
        HOST: process.env.POSTGRES_HOST,
        PORT: Number(process.env.DB_PORT),
        USER: process.env.POSTGRES_USER,
        PASSWORD: process.env.POSTGRES_PASSWORD,
        NAME: process.env.POSTGRES_NAME
    }
}
