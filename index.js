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

// Retrieve powers for a specific superhero ID
app.get('/superheroes/:id/powers', (req, res) => {
    const superhero = superheroes.find(hero => hero.id === parseInt(req.params.id));

    if (superhero) {
        res.send(superhero.powers || "Superhero has no specified powers.");
    } else {
        res.status(404).send(`Superhero ID ${req.params.id} was not found!`);
    }
});

// Retrieve a list of unique publishers
app.get('/publishers', (req, res) => {
    const uniquePublishers = [...new Set(superheroes.map(hero => hero.publisher))];
    res.send(uniquePublishers);
});

// Endpoint to get all superheroes
app.get('/superheroes', (req, res) => {
    res.json(superheroes);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
