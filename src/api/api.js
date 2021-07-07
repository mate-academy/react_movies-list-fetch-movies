const BASE_URL = 'https://www.omdbapi.com?apikey=bcb65536&t=';

export const getData = movieName => fetch(`${BASE_URL}${movieName}`)
  .then(response => response.json())
  .then((response) => {
    if (response.Response === 'False') {
      throw new Error(response.Error);
    }

    return response;
  });
