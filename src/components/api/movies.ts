const API_URL = 'https://www.omdbapi.com/?apikey=1094a50a&t=';

export function getMovieFromServer(movieName: string) {
  const url = API_URL + movieName;

  return fetch(url).then(response => response.json());
}
