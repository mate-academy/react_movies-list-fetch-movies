const API = 'https://www.omdbapi.com/?apikey=4e95fcdc&t=';

export const request = (url: string) => {
  return fetch(`${API}${url}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res.json();
    });
};
