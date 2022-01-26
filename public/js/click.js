
function clicked() {
  fetch('/clicked', {
    method: 'POST'
  }).then(response => {
    if (response.ok) {
      return;
    }
    throw new Error('Request failed.');
  }).catch(error => {
    console.log(error);
  });
}

function setClicks() {
  fetch('/clicks', { method: 'GET' }).then(response => {
    if (response.ok) {
      return response.json()
    }
    throw new Error('Request failed.');
  })
  .then(data => {
    const count = data[0].count;
    document.getElementById('button').innerHTML = count;
  })
  .catch(error => {
    console.log(error);
  });
}

setClicks();

setInterval(setClicks, 1000);