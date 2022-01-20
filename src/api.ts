const BASE_URL = 'https://www.omdbapi.com/?apikey=3c56bad8&';

const request = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovie = (title: string): Promise<Movie> => {
  return request(`t=${title}`);
};
