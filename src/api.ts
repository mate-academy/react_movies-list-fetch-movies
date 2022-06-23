const API = 'https://www.omdbapi.com/?i=tt3896198&apikey=16b19e1d';

export const getFilmByTitle = (title: string): Promise<Movie> => {
  return fetch(`${API}&t=${title}`)
    .then(response => {
      return response.json();
    });
};
