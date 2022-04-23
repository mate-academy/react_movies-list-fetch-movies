const baseUrl = 'https://www.omdbapi.com/?apikey=607d267f&t';

export const getMovie = (movieTitle:string) => {
  return fetch(`${baseUrl}=${movieTitle}`)
    .then(response => response.json());
};
