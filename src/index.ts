import express, {Application, Request, Response} from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'

const app:Application = express()


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'nodejs_beers'
})

app.get('' ,(req:Request, res:Response) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected on ${connection.threadId}`)

        connection.query('SELECT * from beers', (err, rows)=>{
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })

})

app.get('/:id' ,(req:Request, res:Response) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected on ${connection.threadId}`)

        const {id} = req.params

        connection.query(`SELECT * from beers WHERE id = ${id}`, [req.params.id],  (err, rows)=>{
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })

})
 
//delete a record
app.delete('/:id' ,(req:Request, res:Response) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected on ${connection.threadId}`)

        const {id} = req.params

        connection.query(`DELETE from beers WHERE id = ${id}`, (err, rows)=>{
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })

})


//adding a record
app.post('' ,(req:Request, res:Response) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected on ${connection.threadId}`)

        const params = req.body

        connection.query(`INSERT INTO beers SET ?`, params, (err, rows)=>{
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })

})
//editing 
app.put('' ,(req:Request, res:Response) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected on ${connection.threadId}`)

        const {id, name, tagline, description, image} = req.body

        connection.query(`UPDATE beers SET name = ? WHERE id = ?`, [name, id], (err, rows)=>{
            connection.release()

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })

})






app.listen(5000, ()=>{
    console.log('now listening...')
})