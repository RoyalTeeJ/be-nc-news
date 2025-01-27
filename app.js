const express = require('express');
const app = express();
const endpoints = require('./endpoints.json');
const {getTopics} = require('./controllers')

app.get('/api/topics', getTopics)

app.get('/api', (request, response)=>{

    response.status(200).send({endpoints})
})

app.all('*', (request,response)=>{
    response.status(404).send({error: 'Endpoint not found'})
})

module.exports = app