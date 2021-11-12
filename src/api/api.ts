const url = 'https://www.omdbapi.com/?apikey=e63cfb8c&t=';

export const getMovie = (title: string) => {
  return fetch(`${url}${title}`)
    .then(response => response.json());
};
