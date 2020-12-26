import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  const routesPath = `${__dirname}/../routes`
  readdirSync(routesPath)
    .filter(file => !file.includes('.spec.ts'))
    .filter(file => !file.includes('.test.ts'))
    .map(async file => {
      (await import(`${routesPath}/${file}`)).default(router)
    })
}
