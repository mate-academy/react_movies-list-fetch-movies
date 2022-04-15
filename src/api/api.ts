const API_MOVIE = 'https://www.omdbapi.com/?apikey=d44a5ba2&t=';

export const getMovie = (title: string) => (
  fetch(`${API_MOVIE}${title}`)
    .then(response => response.json())
);
