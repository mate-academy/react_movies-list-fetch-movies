const BASE_URL = 'https://www.omdbapi.com/?apikey=d2393c73&t=';

export const getMovie = (endPoint: string): Promise<Movie> => {
  return fetch(`${BASE_URL}${endPoint}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
