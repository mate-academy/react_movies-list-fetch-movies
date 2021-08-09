export function getMovie(title) {
  return fetch(`https://www.omdbapi.com/?apikey=43acaef2&t=${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
