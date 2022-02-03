const API_FILMS_URL = 'https://www.omdbapi.com/?apikey=98f10b26&t=';

export async function searchMovie(title: string) {
  const result = await fetch(`${API_FILMS_URL}${title}`);
  const movie = await result.json();

  if (movie.Response === 'False') {
    throw new Error('Movie is not found');
  }

  return movie;
}
