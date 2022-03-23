const BASE_API_URL = 'https://www.omdbapi.com/?apikey=4661256c&t=';

export const movieFromServer = (query: string) => {
  return fetch(`${BASE_API_URL}${query}`)
    .then(response => response.json());
};
