export async function findMovie(title: string): Promise<Movie> {
  return fetch(`http://www.omdbapi.com/?apikey=93281875&t=${title}`)
    .then(response => response.json())
    .then(movie => {
      if (movie.Response === 'False') {
        return null;
      }

      return movie;
    });
}
