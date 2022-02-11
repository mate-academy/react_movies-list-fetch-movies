const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=a710ccf6&';

export async function getMovie(searchWord: string) {
  const response = await fetch(`${API_URL}t=${searchWord}`);
  const movie = await response.json();

  if (movie.imdbID === undefined) {
    return null;
  }

  return movie;
}
