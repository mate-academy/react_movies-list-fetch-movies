const BASE_URL = 'https://www.omdbapi.com/?apikey=f1ce339b&t=';

export const request = (title: string) => {
  return fetch(`${BASE_URL}${title}`)
    .then(res => res.json())
    .then(res => {
      if (res.Error) {
        throw new Error(`${res.status} - ${res.statusText}`);
      }

      return res;
    });
};
