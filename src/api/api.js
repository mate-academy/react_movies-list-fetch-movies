
export const getMovie = (title) => {
  const URL = `https://www.omdbapi.com/?apikey=d38276c0&t=${title}`;

  return fetch(URL)
    .then(response => response.json());
};
