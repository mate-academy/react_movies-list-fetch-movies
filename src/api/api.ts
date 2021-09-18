export function getMovie(value:string): Promise<FromServer> {
  return fetch(`https://www.omdbapi.com/?apikey=c53d0153&t=${value}`)
    .then(response => response.json());
}
