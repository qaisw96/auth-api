require('dotenv').config()
const SECRET = process.env.SECRET
const jwt = require('jsonwebtoken')
const supergoose = require('@code-fellows/supergoose');
const server = require('../auth-server/src/server')
const Users = require('../auth-server/src/auth/models/users')
const mockServer = supergoose(server.app)

const foodObj = { name: "apple", calories: 22, type: "VEGETABLE" }
const admin = {username: 'alaa', password: 1234, role: 'admin'}
const user = {username: 'alaa'}

beforeAll(async (next)=>{
  await new Users(admin).save();
  
  next();
});

const token = jwt.sign(user, SECRET)
console.log(token);
let id;

describe('V2 (Authenticated API Routes)', () => {
    it('1. POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB', async () => {
        const res = await mockServer.post('/api/v2/food').send(foodObj).set('Authorization', `bearer ${token}`)
        
        const userObj = res.body
        
        expect(userObj.name).toBe(foodObj.name)
        expect(userObj.calories).toBe(foodObj.calories)
        expect(userObj.type).toBe(foodObj.type)
        expect(res.status).toBe(201)
        
    })
    
    it('2. GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async () => {
        const foodObj2 = {name: "watermelon", calories: 5, type: "FRUIT"}
        await mockServer.post('/api/v2/food').send(foodObj2).set('Authorization', `bearer ${token}`)
        const res = await mockServer.get('/api/v2/food').set('Authorization', `bearer ${token}`)
        
        const listOfItems = res.body
        
        expect(listOfItems.length).toBe(2)
        expect(listOfItems[1].name).toBe(foodObj2.name)
        expect(listOfItems[1].calories).toBe(foodObj2.calories)
        expect(listOfItems[1].type).toBe(foodObj2.type)
        expect(res.status).toBe(200) 
        
        id = listOfItems[0]._id

    })


    it('3. GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID', async () => {
        const res = await mockServer.get(`/api/v2/food/${id}`).set('Authorization', `bearer ${token}`)
        const item = res.body
        
        expect(item.name).toBe(foodObj.name)
        expect(item.calories).toBe(foodObj.calories)
        expect(item.type).toBe(foodObj.type)
        expect(res.status).toBe(200) 

    })

    it('4. PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async () => {
        const updatedObj =  { name: "orange", calories: 3, type: "FRUIT" }
        const res = await mockServer.put(`/api/v2/food/${id}`).send(updatedObj).set('Authorization', `bearer ${token}`)
        const item = res.body
        
        expect(item.name).toBe(updatedObj.name)
        expect(item.calories).toBe(updatedObj.calories)
        expect(item.type).toBe(updatedObj.type)
        expect(res.status).toBe(200) 

    })

    it('5. DELETE /api/v2/:model/ID with a bearer token that has delete permissions', async () => {
        await mockServer.delete(`/api/v1/food/${id}`)
        
        let result = await mockServer.get(`/api/v2/food/${id}`).set('Authorization', `bearer ${token}`)
        result = result.body 
        
        expect(result).toBeNull()
    })

})