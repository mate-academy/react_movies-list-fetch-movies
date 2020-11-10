const BASE_URL = 'https://www.omdbapi.com/?apikey=c3b4b8eb';

export function fetchMovieByTitle(title) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json())
    .then(result => ({
      title: result.Title,
      description: result.Plot,
      imgUrl: result.Poster,
      imdbId: result.imdbID,
      imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
    }))
    .catch((error) => {
      throw error;
    });
}
