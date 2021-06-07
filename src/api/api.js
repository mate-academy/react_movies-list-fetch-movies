const BASE_URL = 'https://www.omdbapi.com/?apikey=1aef6206';

export const request = title => fetch(`${BASE_URL}&t=${title}`)
  .then(response => response.json())
  .then((response) => {
    const result = {
      error: response.Error,
      movie: {
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}/`,
        imdbId: response.imdbID,
      },
    };

    return result;
  });
