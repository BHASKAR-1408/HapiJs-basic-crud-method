const fs = require('fs')
const hapi = require('hapi')
const server = new hapi.Server({
    host:"localhost",
    port:2300
})

const data = JSON.parse(fs.readFileSync('data.json'))

// first end point to get the data from json file

server.route({
    method:'GET',
    path:'/get/{username}',
    handler: async(req)=>{
        let dec = true;
        for(let i of data){
            if(i.username === req.params.username){
                dec = false;
                return i 
            }
        }
        if(dec){
            retrun("there is no such type of data")
        }
    }
})

// signup end point 

server.route({
    method:'POST',
    path:'/signup',
    handler:async(req)=>{
        data.push(req.payload)
        let writer = await fs.writeFileSync('data.json',JSON.stringify(data,null,4));
        return "successfully inserted the data"
    }
})

// endpoint for updating

server.route({
    method: ['PUT','PATCH'],
    path:'/update',
    handler: async(req)=>{
        // let body = req.payload
        for(let i of data){
            if(i.username == req.payload.username){
                i.password = req.payload.newpassword
                let updating = fs.writeFileSync('data.json',JSON.stringify(data,null,4))
                return "your password changed successfully"
            }
        }
    }
})

//deleting endpoint

server.route({
    method:'DELETE',
    path:'/delete/{id}',
    handler:async(req)=>{
        let id = req.params.id
        for(let i=0;i<data.length;i++){
            if(data[i].id == id){
                delete data[i]
                let writer = fs.writeFileSync('data.json',JSON.stringify(data,null,4))
                return data
            }
        }
    }
})



server.start(console.log("server is working properly"))
