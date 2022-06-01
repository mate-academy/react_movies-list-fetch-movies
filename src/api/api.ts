// eslint-disable-next-line @typescript-eslint/quotes
const API_URL = `https://www.omdbapi.com/?apikey=44b91b2&t=`;

export async function getMovies(title:string) {
  const response = await fetch(`${API_URL}${title}`);

  const movies = await response.json();

  return movies;
}
