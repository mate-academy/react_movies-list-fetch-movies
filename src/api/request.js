
const apikey = '4d5d73d6';

export const request = title => (
  fetch(`http://www.omdbapi.com/?t=${title}&apikey=${apikey}`)
    .then(response => response.json())
    .catch(error => error)
);
