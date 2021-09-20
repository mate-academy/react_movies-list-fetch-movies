const BASE_URL = ' https://www.omdbapi.com/?apikey=ddf4c823&t=';

export const getFilm = (title: string) => {
  return fetch(`${BASE_URL}${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.statusText}`);
      }

      return response.json();
    });
};
