const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// Serve static files from the 'static' directory
app.use('/', express.static('static'));

// Read superhero data from the JSON file
const rawData = fs.readFileSync('/Users/titomiadeleke/Downloads/superheroes/superhero_info.json');
const superheroes = JSON.parse(rawData);

// Enable parsing of URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());