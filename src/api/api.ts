const BASE_URL = 'https://www.omdbapi.com/?apikey=b0356805&t=';

const request = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};

export const getMovie = (movieTitle: string) => {
  return request(`${movieTitle}`);
};
