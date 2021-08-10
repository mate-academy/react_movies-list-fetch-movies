const BASE_URL = 'https://www.omdbapi.com/?apikey=21a66101';

export const getFilm = (title) => {
  const url = `${BASE_URL}&t=${title}`;

  return fetch(url)
    .then((response) => {
      try {
        return response.json();
      } catch (error) {
        throw new Error('Can&apos;t find a movie with such a title');
      }
    });
};
