const BASE_API = 'http://www.omdbapi.com/?apikey=afe84c1';

export const getMovies = (
  title: string,
  badCallback: () => void,
): Promise<Movie> => {
  return fetch(`${BASE_API}&t=${title}`)
    .then(response => {
      return response.json();
    })
    .catch(badCallback);
};
