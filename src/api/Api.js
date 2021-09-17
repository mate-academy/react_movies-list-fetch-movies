const BASE_URL = 'https://www.omdbapi.com/?apikey=713f09f4&t=';

export const getMovies = (title, options) => {
  return fetch(`${BASE_URL}${title}`, options)
    .then(res => {
      let result;

      try {
        result = res.json();
      } catch (err) {
        return new Error(err);
      }

      return result;
    });
};
