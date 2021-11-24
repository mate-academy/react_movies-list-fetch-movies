export const getMovies = (title: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=3ad1865f&t=${title}`)
    .then(result => result.json());
};
