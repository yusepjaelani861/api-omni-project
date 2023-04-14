import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes'
import errorHandler from './middleware/error'
dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.use('/api', router)
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
