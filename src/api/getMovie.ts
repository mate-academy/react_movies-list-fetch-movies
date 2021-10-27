const API_URL = 'https://www.omdbapi.com/?apikey=79dc99a9';

const getMovie = (query: string) => {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};

export default getMovie;
