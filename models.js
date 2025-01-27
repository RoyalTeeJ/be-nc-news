const db = require('./db/connection.js');


function fetchTopics(){
const SQLString = `SELECT * FROM topics`
return db.query(SQLString).then((response)=>{
return response.rows
})
}

module.exports = {
    fetchTopics
}