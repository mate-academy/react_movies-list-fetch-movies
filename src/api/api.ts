const BASE_URL = 'https://www.omdbapi.com/?apikey=7a30315f&t=';

export const request = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

export const getMovies = (title: string) => {
  return request(title);
};
