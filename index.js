const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use('/', express.static('static'));
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const session = require('express-session');
// Read the JSON file synchronously (for simplicity)
const rawData = fs.readFileSync('/Users/titomiadeleke/Downloads/superheroes/superhero_info.json');
const powers = fs.readFileSync('/Users/titomiadeleke/Downloads/superheroes/superhero_powers.json');
const superheroes = JSON.parse(rawData);
const superheroesPowers = JSON.parse(powers);
app.use(express.static(__dirname + "/static/authenticated.html"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({
    secret: 'r8q,+&1LM3)CDzAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(passport.session());
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
    done(null, user.username);
});
passport.deserializeUser(function (username, done) {
    const user = users.find(u => u.username === username)
    done(null, user);
});

// Get powers for a given superhero ID
app.get('/superheroes/powers/:id', (req, res) => {
    const superheroInfo = superheroes.find(p => p.id === parseInt(req.params.id));
    const superheroPower = superheroesPowers.find(p => p.heroNames === superheroInfo.name);
    if (superheroInfo) {
        res.send(superheroPower);
    }
    else {
        res.status(404).send(`Superhero ID ${req.params.id} was not found!`);
    }
});

app.get('/powers', (req, res) => {
    res.json(superheroesPowers);
});

// Get publisher for a given superhero ID
app.get('/publisher', (req, res) => {
    const superheroInfo = [...new Set(superheroes.map(p => p.Publisher))];
    res.send(superheroInfo);
});

// Example route to send superhero data
app.get('/superheroes', (req, res) => {
    res.json(superheroes);
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

// Function to find matches based on a field, pattern, and number of matches
function match(field, pattern, n) {
    const matches = [];

    superheroes.forEach(superhero => {
        // Case-insensitive matching
        const fieldValue = superhero[field] && superhero[field].toString();
        const patternLower = pattern;

        if (fieldValue && fieldValue.includes(patternLower)) {
            matches.push(superhero.id);
        }

        // Break the loop if n is provided and we have enough matches
        if (n && matches.length >= n) {
            return false;
        }
    });
    return matches.slice(0, n);
}

// Route to perform a search
app.get('/search', (req, res) => {
    const field = req.query.field;
    const pattern = req.query.pattern;
    const amount = req.query.n;
    const response = match(field, pattern, amount);
    res.send(response);
});

// Object to store list names
const listNames = {}

// Route to add names to the list
app.post('/names', (req, res) => {
    const names = [];
    const newName = req.body;

    const superheroInfo = names.find(p => p === newName.name);

    if (newName.name in listNames) {
        res.status(404).send(`${newName.name} already exists!`);
    }
    else {
        console.log('Adding name for ', newName.name);
        listNames[newName.name] = names;
        res.send(listNames);
    }
})

// Function to create or update a superhero list
function createOrUpdateSuperheroList(name, superheroIDs, user, visibility, description, comment, rating) {
    if (!listNames[name]) {
        return `Error: List '${name}' does not exist.`;
    }

    // Replace existing superhero IDs with new values
    const data = listNames[name]
    listNames[name] = {
        superHeroes: superheroIDs.map(item => superheroes.find(superhero => superhero.id === parseInt(item))) ?? data.superHeroes,
        date: Date.now(),
        user: user,
        visibility: visibility ?? data.visibility,
        description: description ?? data.description,
        comment: visibility.includes("public") ? comment ?? data.comment : null,
        rating: visibility.includes("public") ? rating ?? data.rating : null,
    }
    return `Success: Updated superhero list with new IDs: '${listNames[name]}'.`;
}

// Route to update superhero list
app.post('/updateSuperheroList', (req, res) => {
    const { name, superheroIDs, visibility, description, comment, rating } = req.body;
    const result = createOrUpdateSuperheroList(name, superheroIDs, req.user, visibility, description, comment, rating);

    res.status(result.includes('Error') ? 400 : 200).send(result);
});

// Route to get superhero list IDs
app.get('/listids', (req, res) => {
    const listName = req.query.listname;
    if (!listName in listNames) {
        res.status(400).send(`${listName} does not exist!`);
    }
    else {
        res.send(listNames[listName]);
    }
});

// Route to delete a superhero list
app.delete('/deletelist', (req, res) => {
    const listName = req.query.listname;
    if (!listName in listNames) {
        res.status(400).send(`${listName} does not exist!`);
    }
    else {
        delete listNames[listName];
        res.send(listNames)
    }
});

// Route to get information about superhero lists
app.get('/info', (req, res) => {
    const listName = req.query.listname;
    const results = [];
    if (!listName) {
        let numberOfItems = 10
        if (req.isAuthenticated()) {
            numberOfItems = 20
        }
        const sliced = Object.fromEntries(Object.entries(listNames)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, numberOfItems))
        res.send(sliced);
    } else {
        const heroes = listNames[listName];
        res.send(heroes);
    }
});

// Array to store user information
const users = [{
    username: "admin",
    password: "admin",
    nickname: "admin",
    role: "admin",
}]

// Route to render login page
app.get('/login', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/login.html');
});

// Function to validate an email address
function validateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
        console.log("Valid email address!");
        return true;
    } else {
        console.log("Invalid email address!");
        return false;
    }
}

// Passport strategy for local authentication
passport.use(new LocalStrategy(function verify(username, password, cb) {
    const user = users.find(u => u.username === username);
    if (!user) {
        return cb(null, false);
    }
    if (user.password !== password) {
        return cb(null, false);
    }
    if (!validateEmail(username)) {
        return cb(null, false);
    }
    return cb(null, user);
}));

// Route to handle login authentication
app.post('/login', passport.authenticate('local', {
    successRedirect: '/authenticate',
    failureRedirect: '/login'
}));

// Route to render signup page
app.get('/signup', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/signup.html');
});

// Route to handle user signup
app.post('/signup', function (req, res, next) {
    const { username, password, nickname } = req.body;
    const user = users.find(u => u.username === username);
    if (!user && validateEmail(username)) {
        users.push({ username: username, password: password, nickname: nickname });
        res.redirect('/login')
    }
});

// Route to render update password page
app.get('/updatePassword', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/updatePassword.html');
});

// Route to handle updating user password
app.post('/updatePassword', function (req, res, next) {
    const { username, password, newPassword } = req.body;
    const user = users.find(u => u.username === username);
    if (user && password !== newPassword) {
        // Find index of specific object using findIndex method.
        const objIndex = users.findIndex((obj => obj.username == user.username));

        // Update object's name property.
        users[objIndex].password = newPassword;

        res.redirect('/login')
    }
    else {
        return res.status(404).send(`Old password cannot be the same as the new one!`);
    }
});

// Route to render home page
app.get('/home', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/home.html');
});

// Route to handle authentication
app.get('/authenticate', function (req, res, next) {
    if (!req.isAuthenticated()) { next() }
    if (req.user.role === "admin") {
        res.redirect("/admin")
    } else {
        res.sendFile(__dirname + "/static/authenticated.html");
    }
});

// Route to render admin page
app.get('/admin', function (req, res, next) {
    if (!req.user.role === "admin") {
        next()
    }
    res.sendFile(__dirname + "/views/admin.html");
})

// Route to promote a user to manager
app.post('/promoteUser', function (req, res, next) {
    const { nickname } = req.body;
    const userIdx = users.findIndex(u => u.nickname === nickname)
    if (userIdx) {
        const user = users[userIdx]
        users[userIdx] = { ...user, role: "manager" }
    }
    res.send("User promoted to manager")
})

// Route to update review visibility
app.post('/reviewVisibility', function (req, res, next) {
    const { listname, visibility } = req.body
    const curr = listNames[listname]
    if (curr) {
        listNames[listname] = { ...curr, reviewVisibility: visibility }
        console.log(listNames[listname])
    }
    res.send(`Review is now ${visibility}`)
})

// Route to disable a user
app.post('/userDisable', function (req, res, next) {
    const { nickname, disabled } = req.body
    const userIdx = users.findIndex(u => u.nickname === nickname)
    if (userIdx) {
        const user = users[userIdx]
        users[userIdx] = { ...user, status: disabled }
        console.log(users);
    }
    res.send(`User is now ${disabled}`)
})

// Routes for policy pages
app.get('/Ppolicy', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/Ppolicy.html');
});

app.get('/UsePolicy', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/UsePolicy.html');
});

app.get('/TakeDownPolicy', function (req, res, next) {
    res.sendFile('/Users/titomiadeleke/Desktop/se3316-oadelek-lab4/views/TakeDownPolicy.html');
});
