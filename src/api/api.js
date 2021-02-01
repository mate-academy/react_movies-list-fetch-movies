const BASE_URL = 'https://www.omdbapi.com/?t=';
// const DATA_URL = '/?apikey=1aae898a&';
const apikey = '&apikey=1aae898a';

const request = (url, options) => fetch(`${BASE_URL}${url}${apikey}`, options)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json().then((apiMovie) => {
      if (apiMovie.Response === 'False') {
        throw new Error(apiMovie.Error);
      }

      return {
        title: apiMovie.Title,
        description: apiMovie.Plot,
        imgUrl: apiMovie.Poster,
        imdbUrl: apiMovie.imdbID,
        imdbId: apiMovie.imdbID,
      };
    });
  });

export const getFilm = title => request(title);
