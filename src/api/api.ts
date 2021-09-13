const BASE_URL = 'http://www.omdbapi.com/?apikey=eb01c610&';

export const request = (title: string): Promise<MovieFromServer> => {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
