const BASE_URL = 'https://www.omdbapi.com/?apikey=220a05b';

export const moviesFromServer = (endPoint: string) => {
  return fetch(`${BASE_URL}&t=${endPoint}`)
    .then(r => r.json());
};
