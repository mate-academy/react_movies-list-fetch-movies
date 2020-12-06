const BASE_URL = 'http://www.omdbapi.com/?apikey=22c8ca35&t=';

export const request = title => (
  fetch(`${BASE_URL}${title}`)
    .then((response) => {
      if (!response.ok) {
        Promise.reject(new Error(`{response.status}`))
          // eslint-disable-next-line no-console
          .catch(error => console.warn('Error: ', error));
      }

      return response.json();
    })
);
