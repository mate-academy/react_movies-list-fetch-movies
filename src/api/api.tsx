// eslint-disable-next-line @typescript-eslint/quotes
const API_URL = `https://www.omdbapi.com/?apikey=52873c2c`;

export const getMoviesFromServer = (title: string) => {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => response.json());
};
