const API = 'https://www.omdbapi.com/?apikey=4e95fcdc&t=';

export const request = (url: string) => {
  return fetch(`${API}${url}`)
    .then(result => {
      if (!result.ok) {
        throw new Error();
      }

      return result.json();
    });
};
