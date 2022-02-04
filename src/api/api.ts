const API_URL = 'https://www.omdbapi.com/?apikey=e77a0abc&t=';

export function getMovieByTitle(title: string): Promise<Movie> {
  try {
    return fetch(`${API_URL}${title}`)
      .then(response => response.json());
  } catch {
    throw new Error('error');
  }
}
