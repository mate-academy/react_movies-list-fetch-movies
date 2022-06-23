const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=9d3a21ab';

export const getFilmByTitle = (title: string): Promise<Movie> => {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => {
      return response.json();
    });
};
