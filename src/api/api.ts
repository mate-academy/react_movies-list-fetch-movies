// eslint-disable-next-line

const myKey = '68b6f563';

const moviesUrl = `https://www.omdbapi.com/?apikey=${myKey}&t=`;

function request(url: string) {
  return fetch(url)
    .then(response => response.json());
}

export function getMovies(title: string) {
  return request(`${moviesUrl}${title}`);
}
