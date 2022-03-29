/* eslint-disable no-console */
export {};
const myKey = '1d9c16da';

export const getUser = (title: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=${myKey}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('');
      }

      return response.json();
    });
};
