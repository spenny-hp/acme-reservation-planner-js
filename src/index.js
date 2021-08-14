async function generateUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();
    return users;
}

async function generateRestaurants() {
    const response = await fetch('/api/restaurants');
    const restaurants = await response.json();
    return restaurants;
}

async function generateReservations(userId) {
    const response = await fetch(`/api/users/${userId}/reservations`);
    const reservations = await response.json();
    console.log(reservations);
    return reservations;
}

async function renderUsers() {
    const users = await generateUsers();
    const userList = document.querySelector('#users-list');
    const hash = window.location.hash.slice(6);
    const html = users.map( (user) => {
        return `
          <li class='user'>
            <a href='#user_${user.id}'>${ user.name.charAt(0).toUpperCase() + user.name.slice(1) }</a>
            ${ parseInt(hash) === user.id ? `<pre>${ JSON.stringify(user, null, 2)}</pre>` : ''}
          </li>
        `;
      }).join('');
      userList.innerHTML = html;
}

async function renderRestaurants() {
    const restaurants = await generateRestaurants();
    const restaurantList = document.querySelector('#restaurants-list');
    const hash = window.location.hash.slice(12);
    const html = restaurants.map( (rest) => {
        return `
          <li class='rest'>
            <a href='#restaurant_${rest.id}'>${ rest.name }</a>
            ${ parseInt(hash) === rest.id ? `<pre>${ JSON.stringify(rest, null, 2)}</pre>` : ''}
          </li>
        `;
      }).join('');
      restaurantList.innerHTML = html;
}

async function renderReservations() {
    const users = await generateUsers();
    const userMap = users.reduce((acc, val) => {
        acc[val.id] = val.name.charAt(0).toUpperCase() + val.name.slice(1);
        return acc;
    }, {})
    const restaurants = await generateRestaurants();
    const restaurantMap = restaurants.reduce((acc, val) => {
        acc[val.id] = val.name;
        return acc;
    }, {})

    const userId = window.location.hash.slice(6);
    
    const reservations = await generateReservations(userId);
    const reservationList = document.querySelector('#reservations-list');
    const html = reservations.map( (rsvp) => {
        return `
          <li class='rsvp'>
            ${userMap[rsvp.userId]} @ ${ restaurantMap[rsvp.restaurantId] }
          </li>
        `;
      }).join('');
      
      if (Object.keys(userMap).includes(userId)) {
        reservationList.innerHTML = html;
      } else {
        reservationList.innerHTML = '';
      }
      console.log(userId);
}

const init = () => {
    renderUsers();
    renderRestaurants();
    renderReservations();
}

init();

window.addEventListener('hashchange', init);