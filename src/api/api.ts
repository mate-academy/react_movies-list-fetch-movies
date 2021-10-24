export async function loadMovies() {
  return fetch('https://www.omdbapi.com/?s=dark&apikey=b37bbadc')
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}

export async function findMovie(query: string): Promise<Movie> {
  return fetch(`https://www.omdbapi.com/?t=${query}&apikey=b37bbadc`)
    .then(response => response.json())
    .then(movie => {
      if (movie.Response === 'False') {
        return null;
      }

      return movie;
    });
}
