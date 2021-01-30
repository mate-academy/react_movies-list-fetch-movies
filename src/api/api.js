const BASE_URL = 'https://www.omdbapi.com/?apikey=bef2d35c&';

export const getMovieFromApi = title => fetch(`${BASE_URL}t=${title}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status}---${response.statusText}`);
    }

    return response.json();
  });
