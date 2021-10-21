'use stript';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = process.env.PORT || 3000;

app.get('/', express.static(__dirname + '/pages'));

http.listen(PORT, function () {
    console.log(`listening at port ${PORT}...`);
});