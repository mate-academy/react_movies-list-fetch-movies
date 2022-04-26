const BASE_URL = 'https://www.omdbapi.com/?apikey=f23c7f6&t';

export const request = (title: string) => {
  return fetch(`${BASE_URL}=${title}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`${response.status} - ${response.statusText}`),
        );
      }

      return response.json();
    });
};
