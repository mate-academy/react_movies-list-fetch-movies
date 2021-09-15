const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=20bbe522&t=';

export const getMovie = (query) => {
  return fetch(`${BASE_URL}${query}`)
    .then(result => {
      if (!result.ok) {
        throw new Error(result.statusText);
      }

      return result.json();
    });
};
