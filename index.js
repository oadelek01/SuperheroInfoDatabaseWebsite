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

// Function to find superhero IDs that match a given field and pattern
function searchSuperheroes(field, pattern, limit) {
    const matches = superheroes.filter(superhero => {
        const fieldValue = superhero[field] && superhero[field].toString().toLowerCase();
        const patternLower = pattern.toLowerCase();

        return fieldValue && fieldValue.includes(patternLower);
    });

    return matches.slice(0, limit);
}

// Endpoint to search for superhero IDs based on a field and pattern
app.get('/search', (req, res) => {
    const { field, pattern, limit } = req.query;
    console.log(`Searching for ${limit} matches with ${field} containing ${pattern}`);
    const response = searchSuperheroes(field, pattern, limit);
    res.send(response);
});  

// Object to store superhero names
const superheroNames = {}

// Endpoint to add superhero names
app.post('/supernames', (req, res) => {
    const names = [];
    const newName = req.body;
    console.log("Name: ", newName);
    
    const superheroInfo = names.find(name => name === newName.name);

    if (newName.name in superheroNames) {
        res.status(404).send(`${newName.name} already exists!`);
    }
    else {
        console.log('Adding name for ', newName.name);
        superheroNames[newName.name] = names;
        res.send(superheroNames);
    }
})

// Function to create or update a superhero list
function updateSuperheroList(name, superheroIDs) {
    if (!superheroNames[name]) {
        return `Error: List '${name}' does not exist.`;
    }

    superheroNames[name] = superheroIDs;
    return `Success: Updated superhero list with new IDs: '${superheroNames[name]}'.`;
}

// Endpoint to update a superhero list
app.post('/updatesuperList', (req, res) => {
    const { name, superheroIDs } = req.body;
    const result = updateSuperheroList(name, superheroIDs);
    res.status(result.includes('Error') ? 400 : 200).send(result);
});

// Endpoint to retrieve superhero IDs in a list
app.get('/listIds', (req, res) => {
    const listName = req.query.listName;
    if (!(listName in superheroNames)) {
        res.status(400).send(`${listName} does not exist!`);
    }
    else {
        res.send(superheroNames[listName]);
    }
});

// Endpoint to delete a superhero list
app.delete('/deleteList', (req, res) => {
    const listName = req.query.listName;
    if (!(listName in superheroNames)) {
        res.status(400).send(`${listName} does not exist!`);
    }
    else {
        delete superheroNames[listName];
        res.send(superheroNames)
    }
});

// Endpoint to retrieve superhero information based on a list
app.get('/information', (req, res) => {
    const listName = req.query.listName;
    const ids = superheroNames[listName] || [];
    const results = ids.map(id => superheroes.find(superhero => superhero.id === id));
    res.send(results);
});
