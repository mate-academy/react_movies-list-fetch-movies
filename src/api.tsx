export function getMovie(title: string): Promise<Movie> {
  return fetch(`https://www.omdbapi.com/?apikey=c48d1bf&t=${title}`)
    .then(response => (response.ok
      ? response.json()
      // eslint-disable-next-line prefer-promise-reject-errors
      : Promise.reject('someErrorMessage')));
}
