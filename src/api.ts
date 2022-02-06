export function findMovie(title: string): Promise<Movie> {
  return fetch(`https://www.omdbapi.com/?apikey=c87ce527&t=${title}`)
    .then(response => response.json())
    .then(movie => movie);
}
