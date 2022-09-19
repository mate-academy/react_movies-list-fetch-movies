const API_URL = 'https://www.omdbapi.com/';

export const request = async (addUrl: string): Promise<Movie> => {
  // eslint-disable-next-line no-console
  console.log(`${API_URL}${addUrl}`);

  return fetch(`${API_URL}${addUrl}`)
    .then(response => {
      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.log('response error');
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw `${response.status} - ${response.statusText}`;
      }

      return response.json();
    });
};
