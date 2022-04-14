const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=3dfb3239';

export const request = (url: string, options?: RequestInit) => {
  return fetch(`${BASE_URL}${url}`, options)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};

export const findMovie = (query: string): Promise<Movie> => {
  return request(`&t=${query}`);
};
