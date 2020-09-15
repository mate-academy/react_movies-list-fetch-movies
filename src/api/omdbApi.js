const URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=f7dddb7c&t=';

export const fetchMovie = title => (
  fetch(`${URL}${title}`)
    .then(response => response.json())
);
