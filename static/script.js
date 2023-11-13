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
        })})}