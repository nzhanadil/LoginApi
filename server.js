import express from 'express'
import {v4 as uuidv4} from 'uuid'
import {readFile, writeFile} from 'node:fs/promises'

const server = express();
const port  = process.env.PORT || 8000;

server.use(express.json())


server.get('/', async (req, res)=>{
    try{
        const users = await readData();
        res.json(users)
    } catch(error){
        res.json({error: "Something went wrong!"})
    }
})

server.get('/users/', async (req, res)=>{
    const {username, password} = req.body;
    try{
        const users = await readData();

        const user = users.find(user => user.username===username)
        
        if(user !== undefined && user.password === password){
            res.status(200).json(user)
        } else{
            res.status(401).json({message: `Username or Password is incorrect, please try again!`})
        }
    } catch(error){
        res.status(500).json({error: "Something went wrong!"})
    }
})

server.delete('/users/', async (req, res)=>{
    const {username, password} = req.body;
    try{
        const users = await readData();

        const user = users.find(user => user.username===username)
        
        if(user !== undefined && user.password === password){
            writeData(users.filter(user => user.username !== username))

            res.status(200).json({message: `user ${username} deleted successfully!`})
        } else{
            res.status(401).json({message: `Username or Password is incorrect, please try again!`})
        }
    } catch(error){
        res.status(500).json({error: "Something went wrong!"})
    }
})

server.post('/users/', async (req, res)=>{
    const {phoneNumber, fullName, username, password} = req.body;
    try{
        let users = await readData();

        console.log(users)

        if(users.some(user => user.username===username)){
            res.status(403).json({message: `username ${username} is already taken!`})
        }else{
            users.push({
                id : uuidv4(10),
                phoneNumber : phoneNumber,
                fullName: fullName,
                username: username,
                password: password
            })

            writeData(users)
            
            res.status(201).json({message:"account was created successfully!"})
        }
    } catch(error){
        res.status(500).json({message: "Something went wrong!"})
    }
})

server.patch('/', async (req, res)=>{
    
})

server.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`)
})

async function readData(){
    const data = await readFile('./data/users.json', {encoding:"utf8"})
    return JSON.parse(data)
}

function writeData(data){
    writeFile('./data/users.json', JSON.stringify(data, undefined, 4), () =>{})
}
