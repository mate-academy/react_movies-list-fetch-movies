// eslint-disable-next-line
const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=d99f9187&t=';

export const getMovie = (url: string): Promise<DataFromServer> => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
