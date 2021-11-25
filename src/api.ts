export const getMovie = (title: string) => {
  const API = `https://www.omdbapi.com/?apikey=67580636&t=${title}`;

  return fetch(API)
    .then(res => res.json());
};
