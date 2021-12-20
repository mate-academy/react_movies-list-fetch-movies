const BASE_URL = 'https://www.omdbapi.com/?apikey=1f7a950a&t=';

export function getMovies(title: string) {
  return fetch(`${BASE_URL}${title}`)
    .then(response => response.json());
}
