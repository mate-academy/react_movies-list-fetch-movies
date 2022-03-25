const API_URL = 'https://www.omdbapi.com/?apikey=f6a5875a&t=';

export const getMovie = (query: string): Promise<Movie> => {
  return fetch(`${API_URL}${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Status of error: ${response.status}`);
      }

      return response.json();
    });
};
