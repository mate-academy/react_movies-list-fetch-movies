const BASE_URL = 'https://www.omdbapi.com';

export async function request(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getMovieByTitle(title: string): Promise<Movie> {
  const movie = await request(`${BASE_URL}/?apikey=ef976414&t=${title}`);

  if (movie.Response === 'False') {
    throw new Error(`Error: ${movie.Error}`);
  }

  return movie;
}
