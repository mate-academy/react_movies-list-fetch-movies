const baseUrl = 'https://www.omdbapi.com/';
const apikey = '6d745cec';

export const getMovie = (searchedTitle: string) => {
  return fetch(`${baseUrl}?apikey=${apikey}&t=${searchedTitle}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new TypeError(`${response.status} - ${response.statusText}`));
      }

      return response.json();
    });
};
