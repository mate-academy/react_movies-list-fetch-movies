export const findMovie = (title: string) => {
  const URL = `http://www.omdbapi.com/?apikey=7477c903&t=${title}`;

  return fetch(URL)
    .then(res => res.json());
};
