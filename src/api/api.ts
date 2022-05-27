const API_URL = 'https://www.omdbapi.com/?apikey=59f6cb1b';

export async function getMovie(title: string): Promise<Movie> {
  const response = await fetch(`${API_URL}&t=${title}`);

  if (!response.ok) {
    switch (response.status) {
      case 404:
        throw new Error('Can\'t find a movie with such a title');

      default:
        throw new Error('Server respond with error');
    }
  }

  const gottenMovie = await response.json();

  return gottenMovie;
}
