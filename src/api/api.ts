const API_URL = 'https://www.omdbapi.com/?apikey=5f79d9b4&';

export const getData = (title: string):Promise<ApiMovie> => {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
