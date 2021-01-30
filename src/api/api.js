const BASE_URL = 'http://www.omdbapi.com/?apikey=bef2d35c&t=';

export const getMovieFromApi = title => fetch(`${BASE_URL}${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status}---${response.statusText}`);
    }

    return response.json();
  });
