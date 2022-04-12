const BASE_URL = 'http://www.omdbapi.com/?apikey=baafa03e&t=';

export const request = async (movieTitle: string) => {
  const response = await fetch(`${BASE_URL}${movieTitle}`);

  if (!response.ok) {
    throw new Error(`Status: ${response.status}
      - StatusText: ${response.statusText}`);
  }

  const movie = await response.json();

  if (movie.Response === 'False') {
    return null;
  }

  return movie;
};
