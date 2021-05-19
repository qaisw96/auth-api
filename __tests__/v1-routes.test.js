'use strict';


const supergoose = require('@code-fellows/supergoose');
const server = require('../auth-server/src/server')
// const supertest = require('supertest')
const mockServer = supergoose(server.app)

const foodObj = {
    name: "apple",
    calories: 22,
    type: "VEGETABLE"
}

let id;
describe('1. V1 (Unauthenticated API) routes', () => {
    it('POST /api/v1/:model adds an item to the DB and returns an object with the added item', async () => {
        const res = await mockServer.post('/api/v1/food').send(foodObj)
        
        const userObj = res.body
        
        expect(userObj.name).toBe(foodObj.name)
        expect(userObj.calories).toBe(foodObj.calories)
        expect(userObj.type).toBe(foodObj.type)
        expect(res.status).toBe(201)

    })
    
    it('2. GET /api/v1/:model returns a list of :model items', async () => {
        const foodObj2 = {
            name: "watermelon",
            calories: 5,
            type: "FRUIT"
        }
        await mockServer.post('/api/v1/food').send(foodObj2)
        const res = await mockServer.get('/api/v1/food')
        
        const listOfItems = res.body
        
        expect(listOfItems.length).toBe(2)
        expect(listOfItems[1].name).toBe(foodObj2.name)
        expect(listOfItems[1].calories).toBe(foodObj2.calories)
        expect(listOfItems[1].type).toBe(foodObj2.type)
        expect(res.status).toBe(200) 
        
        id = listOfItems[0]._id
    })
    
    it('3. GET /api/v1/:model/ID returns a single item by ID', async () => {
        
        const res = await mockServer.get(`/api/v1/food/${id}`)
        const item = res.body
        
        expect(item.name).toBe(foodObj.name)
        expect(item.calories).toBe(foodObj.calories)
        expect(item.type).toBe(foodObj.type)
        expect(res.status).toBe(200) 

        id = item._id
    })
    
    it('4. PUT /api/v1/:model/ID returns a single, updated item by ID', async () => {
        const updatedObj =  { name: "orange", calories: 3, type: "FRUIT" }

        const res = await mockServer.put(`/api/v1/food/${id}`).send(updatedObj)
        const item = res.body
        
        expect(item.name).toBe(updatedObj.name)
        expect(item.calories).toBe(updatedObj.calories)
        expect(item.type).toBe(updatedObj.type)
        expect(res.status).toBe(200) 
    })
    
    it('5. DELETE /api/v1/:model/ID returns an empty object', async () => {
        await mockServer.delete(`/api/v1/food/${id}`)
        
        let result = await mockServer.get(`/api/v1/food/${id}`)
        result = result.body 
        
        expect(result).toBeNull()
    })
})