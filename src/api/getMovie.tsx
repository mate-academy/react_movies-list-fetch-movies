const BASE_URL = 'https://www.omdbapi.com/?apikey=4cadda20&t';

function request(url: string) {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status}-${response.statusText}`));
      }

      return response.json();
    });
}

export const getMovie = (title: string): Promise<Movie> => request(`=${title}`);
