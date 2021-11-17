export async function getMovies(title:string) {
  const response = await fetch(`https://www.omdbapi.com/?apikey=bde4eea5&t=${title}`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error(`Movie is not found ${response.status} - ${response.statusText}`);
  }

  return movie;
}
