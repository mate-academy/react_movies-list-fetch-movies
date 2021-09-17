export const url = 'https://www.omdbapi.com/?apikey=750c80fc';

export const loadMovie = (title: string) => {
  return fetch(`${url}&t=${title}`)
    .then(response => {
      return response.json();
    });
};
