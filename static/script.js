// Function to search superheroes based on a specific criteria
function searchSuperheroes() {
    const searchCriteria = document.getElementById('searchCriteria').value;
    let heroPowers = [];

    // Fetch superhero powers data
    fetch(`http://localhost:3000/powers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(results => {
        // Filter powers based on the search criteria
        heroPowers = results.filter(power => power[searchCriteria] === 'True');

        // Fetch superhero data
        fetch(`http://localhost:3000/superheroes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(results => {
            // Display the results on the webpage
            const resultsList = document.getElementById('resultsList');
            resultsList.innerHTML = '';

            // Filter superheroes based on multiple criteria
            const filterResults = results.filter(hero => {
                return hero.name.includes(searchCriteria) || hero.Race.includes(searchCriteria) || hero.Publisher.includes(searchCriteria);
            });

            // Display filtered superheroes or heroes with matching powers
            if (heroPowers.length > 0) {
                heroPowers.forEach(hero => {
                    const listItem = document.createElement('li');
                    listItem.appendChild(document.createTextNode(`${hero.hero_names}`))
                    resultsList.appendChild(listItem);
                });
            }
            else {
                filterResults.forEach(hero => {
                    const listItem = document.createElement('li');
                    listItem.appendChild(document.createTextNode(`${hero.name} (${hero.Publisher}) - ${hero.Race}`))
                    resultsList.appendChild(listItem);
                });
            } 
        })
    })
    .catch(error => console.error('Error in searchSuperheroes:', error));  
}

// Function to create a superhero list
function createList() {
    const listName = document.getElementById('listName').value;

    // Send a POST request to create a new list
    fetch(`http://localhost:3000/names`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": listName,
        }),
    })
    .catch(error => console.error('Error in createList:', error));
}

// Function to add a superhero to a list
function addToList() {
    const addToListName = document.getElementById('listName').value;
    const addToList = document.getElementById('addToList').value;
    const description = document.getElementById('description').value;
    const visibility = document.querySelector('input[name="visibility"]:checked').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    // Send a POST request to update the superhero list
    fetch(`http://localhost:3000/updateSuperheroList`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": addToListName,
            "superheroIDs": [addToList],
            "description": description,
            "visibility": visibility,
            "rating": rating,
            "comment": comment,
        }),
    })
    .catch(error => console.error('Error in addToList:', error));
}
