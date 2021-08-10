export function getMovie(query) {
  return fetch(`https://www.omdbapi.com/?apikey=43acaef2&t=${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
