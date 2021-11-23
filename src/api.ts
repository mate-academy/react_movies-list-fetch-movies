export async function getMovie(title:string) {
  const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=fb9260dd`);
  const movie = await response.json();

  if (movie.Response === 'False') {
    throw new Error(`Movie is not found ${movie.status}`);
  }

  return movie;
}
