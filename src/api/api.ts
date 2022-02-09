export function getMovie(title: string): Promise<Movie> {
  return fetch(`https://www.omdbapi.com/?apikey=7a422092&t=${title}`)
    .then(response => response.json());
}
