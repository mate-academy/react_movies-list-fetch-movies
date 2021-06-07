export const request = title => (
  fetch(`https://www.omdbapi.com/?t=${title}&apikey=ff1edd93`)
    .then(response => response.json())
    .catch(error => error)
);
