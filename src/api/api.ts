export const getMovie = (name: string): Promise<Movie> => {
  return fetch(`https://www.omdbapi.com/?apikey=4ab6445f&t=${name}`)
    .then(response => response.json());
};
