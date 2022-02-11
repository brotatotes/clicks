
function clicked() {
  fetch('/clicked', {
    method: 'POST'
  }).then(response => {
    if (response.ok) {
      return;
    }
    throw new Error('Request failed.');
  }).catch(error => {
    console.error(error);
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
    const count = data.count;
    document.getElementById('button').innerHTML = count;
  })
  .catch(error => {
    console.error(error);
  });
}

async function getPollingInterval() {
  return await fetch('/pollingInterval', { method: 'GET' }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed.');
  }).then(data => {
    const pollingInterval = data.pollingInterval;
    return pollingInterval;
  }).catch(error => console.error(error));
}

setClicks();

getPollingInterval().then(result => {
  setInterval(setClicks, result);
}).catch(error => console.error(error));