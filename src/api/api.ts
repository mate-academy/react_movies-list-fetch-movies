const API_URL = 'https://www.omdbapi.com/?apikey=ca99bee2&t=';

export const loadMovies = (title: string): Promise<Movie> => {
  return fetch(`${API_URL}${title}`)
    .then(response => {
      return response.ok
        ? response.json()
        : Promise.reject(new Error('Failed to load data'));
    });
};
