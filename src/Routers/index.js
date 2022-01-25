const { add } = require("../Controllers/account");


function route(app){
    app.post('/add',add)
}

module.exports = route;

