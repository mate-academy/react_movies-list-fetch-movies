const API_URL = 'https://www.omdbapi.com/?apikey=d963524c';

const request = (url: string): Promise<any> => {
  return fetch(`${API_URL}${url}`)
    .then(response => response.json())
    .then(result => {
      if (result.Response === 'False') {
        throw new Error();
      }

      return result;
    });
};

export const getMovie = (movieTitle: string):Promise<Movie | any> => {
  return request(`&t=${movieTitle}`);
};
