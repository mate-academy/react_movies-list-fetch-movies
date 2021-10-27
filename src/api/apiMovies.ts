const apiUrlWithKey = 'http://www.omdbapi.com/?apikey=5f31a063';

export const getMovieFromServer = (title: string): Promise<Movie> => (
  fetch(`${apiUrlWithKey}&t=${title}`)
    .then(response => response.json())
    .then(movie => {
      if (movie.Response === 'False') {
        return null;
      }

      return movie;
    })
);
