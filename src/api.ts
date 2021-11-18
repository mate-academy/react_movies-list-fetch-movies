export const findMovie = (title: string) => {
  const URL = `https://www.omdbapi.com/?apikey=7477c903&t=${title}`;

  return fetch(URL)
    .then(res => res.json());
};
