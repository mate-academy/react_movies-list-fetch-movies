const API_BASE_URL = 'http://www.omdbapi.com/?apikey=7d946cd0&t=';

export async function getNewMovie(movie: string): Promise<NewMovie> {
  const response = await fetch(`${API_BASE_URL}${movie}`);
  const data: OmdbResponse = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error);
  }

  return data as unknown as NewMovie;
}
