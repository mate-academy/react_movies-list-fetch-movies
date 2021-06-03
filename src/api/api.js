const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=6811da81&';

// eslint-disable-next-line
const getData = (param) => {
  return fetch(`${BASE_URL}${param}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(`${response.status}: ${response.statusText}`);
    })
    .then((response) => {
      const isError = response?.Error;

      if (!isError) {
        return response;
      }

      return null;
    });
};

export const getMovie = title => getData(`t=${title}`);
