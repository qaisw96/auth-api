'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../auth-server/src/server')
const mockServer = supergoose(server.app)

const testUser = { username: "qaisw155", password: "159951", role: "editor"}

describe('AUTH Routes', () => {
    
    it('1. POST /signup creates a new user and sends an object', async () => {
        const res = await mockServer.post('/signup').send(testUser)
        let userObj = res.body
        
        expect(userObj.user.username).toEqual(testUser.username)
        expect(userObj.token).toBeDefined();
        expect(userObj.user._id).toBeDefined();
        expect(res.status).toBe(201);
    })

    it('2. POST /signin with basic authentication headers logs in a user and sends an object', async () => {
        let res = await mockServer.post('/signin').auth(testUser.username, testUser.password)
        
        const userObj = res.body
        expect(userObj.user.username).toEqual(testUser.username)
        expect(userObj.token).toBeDefined();
        expect(userObj.user._id).toBeDefined();
        expect(res.status).toBe(200);
    })

})