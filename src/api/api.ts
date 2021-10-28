const MAIN_URL = 'https://www.omdbapi.com/?apikey=203a0934';

export function getMovies(title: string) {
  return fetch(`${MAIN_URL}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
