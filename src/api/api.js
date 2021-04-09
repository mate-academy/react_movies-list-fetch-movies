const BASE__URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=d49fb33b&t=';

export const request = endPointTitle => (
  fetch(`${BASE__URL}${endPointTitle}`)
    .then(response => response.json())
    .catch(() => new Error('film not found'))
);
