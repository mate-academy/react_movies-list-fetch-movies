
const apikey = '4d5d73d6';

const url = 'https://www.omdbapi.com/';

export const request = title => (
  fetch(`${url}?t=${title}&apikey=${apikey}`)
    .then(response => response.json())
    .catch(error => error)
);
