// Your searchSuperheroes function
function searchSuperheroes() {
    const searchCriteria = document.getElementById('searchCriteria').value;
    let hero_powers = [];
    fetch(`http://localhost:3000/powers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(results => {
        hero_powers = results.filter(power => {
            console.log(power[searchCriteria]);
            return power[searchCriteria] === 'True';
        })
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
            const filterResults = results.filter(hero => {
                return hero.name.includes(searchCriteria) || hero.Race.includes(searchCriteria) || hero.Publisher.includes(searchCriteria);
            })
            if (hero_powers.length > 0) {
                hero_powers.forEach(hero => {
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
    .catch(error => console.error('Error:', error));  
}

function createList() {
    const listName = document.getElementById('listName').value;
    fetch(`http://localhost:3000/supernames`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": `${listName}`
        }),
    })
}