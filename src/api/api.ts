const API_URL = 'https://www.omdbapi.com/?apikey=d4cd05b';

export const getMovie = (title: string) :Promise<APIMovie> => {
  return fetch(`${API_URL}&t=[${title}]`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
