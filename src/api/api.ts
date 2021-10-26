export function findMovie(title: string): Promise<Movie> {
  return fetch(`https://www.omdbapi.com/?apikey=27cc74b7&t=${title}`)
    .then(response => response.json())
    .then(movie => movie);
}
