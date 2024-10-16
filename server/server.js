import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'
import {query as db} from './src/db/index.js'
import cookieParser from 'cookie-parser'


const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true , limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());
app.use(morgan('dev'));


const port = process.env.PORT || 3001;

app.get('/', async (req, res)=>{
   try {
       const results = await db("select * from person");
       console.log(results.rows);
       res.send("loda");
       
   } catch (error) {
    console.log(error)
   }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})