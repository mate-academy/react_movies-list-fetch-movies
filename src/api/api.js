const BASE_URL = 'https://www.omdbapi.com/?apikey=cfe9a10e&t=';

export const getMovie = url => fetch(`${BASE_URL}${url}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  });
