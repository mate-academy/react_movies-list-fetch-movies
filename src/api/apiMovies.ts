const apiUrlWithKey = 'http://www.omdbapi.com/?';
const apiKey = 'apikey=5f31a063';

export const getMovieFromServer = (title: string): Promise<Movie> => (
  fetch(`${apiUrlWithKey}t=${title}&${apiKey}`)
    .then(response => response.json())
    .then(movie => {
      if (movie.Response === 'False') {
        return null;
      }

      return movie;
    })
);
