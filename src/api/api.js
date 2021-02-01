export function getMovie(query) {
  return fetch(`https://www.omdbapi.com/?apikey=2c7217b5&t=${query}`)
    .then(response => response.json());
}
