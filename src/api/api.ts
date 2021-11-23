const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=12cb3730';

export async function getMovies(title:string) {
  const response = await fetch(`${BASE_URL}&t=${title}`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error(`Movie is not found ${response.status} - ${response.statusText}`);
  }

  return movie;
}
