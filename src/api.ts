const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=fc0e54a9&t=';

export function getMovie(title: string) :Promise<Movie> {
  return fetch(`${API_URL}${title}`)
    .then(response => response.json());
}
