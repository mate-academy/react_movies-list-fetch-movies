const API_URL = 'https://www.omdbapi.com/?apikey=1ed3d21c&t=';

export const request = (title: string): Promise<Movie> => {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json())
    .then(response => {
      if (response.Error) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response;
    });
};
