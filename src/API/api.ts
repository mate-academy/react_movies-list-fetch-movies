const API_URL = 'https://www.omdbapi.com/?apikey=9d3a21ab';

export const getFilmByTitle = (title: string): Promise<Movie> => {
  return fetch(`${API_URL}&t=${title}`)
    .then(response => {
      return response.json();
    });
};
