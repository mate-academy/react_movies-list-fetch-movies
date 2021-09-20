const API_URL = 'http://www.omdbapi.com/?apikey=4d03bd25';

export const getMovie = (title: string): Promise<ApiMovie> => {
  return fetch(`${API_URL}&t=[${title}]`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
