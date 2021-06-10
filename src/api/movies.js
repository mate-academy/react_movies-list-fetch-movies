const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=7d7581f1&t=';

export const getMovie = title => fetch(`${BASE_URL}${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
