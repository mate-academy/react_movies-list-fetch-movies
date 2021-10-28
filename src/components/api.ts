const API_URL = 'http://www.omdbapi.com/?api';
const key = 'key=ef64fce9';
const param = '&t=';

export const request = (title: string) => {
  return fetch(`${API_URL}${key}${param}${title}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.status}-${res.statusText}`);
      }

      return res.json();
    });
};
