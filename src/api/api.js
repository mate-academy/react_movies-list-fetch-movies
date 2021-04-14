export function getMovies(title) {
  return fetch(`https://www.omdbapi.com/?apikey=e2d69361&t=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
