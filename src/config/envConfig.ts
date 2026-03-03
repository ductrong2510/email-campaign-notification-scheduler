import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import z from 'zod'

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Không tìm thấy file .env')
  process.exit(1)
}

const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
})

const configServer = ConfigSchema.safeParse(process.env)

if (!configServer.success) {
  console.error('Cấu hình .env không đúng định dạng')
  process.exit(1)
}

const envConfig = configServer.data
export default envConfig
