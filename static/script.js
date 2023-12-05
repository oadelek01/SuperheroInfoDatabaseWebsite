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

// Function to display a superhero list
function displayList() {
    const listName = document.getElementById('displayList').value;
    let heroList = [];

    // Check if a specific list is selected
    if (!listName) {
        // Fetch information about all superhero lists
        fetch(`http://localhost:3000/info`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(results => {
            // Display the results on the webpage
            const resultsList = document.getElementById('resultsList');
            heroList = results;
            resultsList.innerHTML = '';

            // Iterate through the superhero lists and display basic information
            for (const key in heroList) {
                const info = heroList[key];
                const listItem = document.createElement('li');
                listItem.appendChild(document.createTextNode(`${key} (${info?.user?.nickname}) - ${info.superHeroes?.length}`))
                var button = document.createElement('button');
                button.id = "btnItems";
                button.textContent = "Expand list";
                button.onclick = function(el) {
                    el.target.disabled = true;
                    window.location.href = `http://localhost:3000/info?listname=${key}`;
                }
                listItem.appendChild(button);
                resultsList.appendChild(listItem);
            }
        })
        .catch(error => console.error('Error in displayList:', error));
    } else {
        // Fetch information about a specific superhero list
        fetch(`http://localhost:3000/info?listname=${listName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(results => {
            // Display the results on the webpage
            const resultsList = document.getElementById('resultsList');
            heroList = results;
            resultsList.innerHTML = '';

            // Fetch powers for the first hero in the list
            fetch(`http://localhost:3000/superheroes/powers/${results[0].id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(results => {
                console.log(results);
                // Display information about each hero in the list along with their powers
                heroList.forEach(hero => {
                    const powers = Object.keys(results).filter(key => results[key] === "True");
                    const listItem = document.createElement('li');
                    listItem.appendChild(document.createTextNode(`${hero.name} (${hero.Publisher}) - ${hero.Race} \n ${powers}`))
                    resultsList.appendChild(listItem);
                })
            })
        })
        .catch(error => console.error('Error in displayList:', error));  
    }
}

// Function to update user password
function updatePassword() {
    console.log('test')
    document.location.href = "http://localhost:3000/updatePassword";
}

// Function to search superheroes based on a combination of criteria
function searchSuperheroesCombination() {
    const nameSearch = document.getElementById('name').value;
    const raceSearch = document.getElementById('race').value;
    const powerSearch = document.getElementById('power').value;
    const publisherSearch = document.getElementById('publisher').value;
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
        heroPowers = results.filter(power => power[powerSearch] === 'True');

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
            let filterResults = results.filter(hero => hero.name.includes(nameSearch))
                .filter(hero => hero.Race.includes(raceSearch))
                .filter(hero => hero.Publisher.includes(publisherSearch));

            // Display filtered superheroes or heroes with matching powers
            if (heroPowers.length > 0) {
                filterResults = filterResults.filter(result => heroPowers.some(power => power.hero_names.includes(result.name)));
                console.log(filterResults);
                filterResults.forEach(hero => {
                    const listItem = document.createElement('li');
                    listItem.appendChild(document.createTextNode(`${hero.name} (${hero.Publisher}) - ${hero.Race}`))
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
    .catch(error => console.error('Error in searchSuperheroesCombination:', error));  
}
