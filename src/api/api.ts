const url = 'https://www.omdbapi.com/?apikey=1d993069&t=';

export const getData = (title: string) => {
  return fetch(url + title)
    .then(p => p.json());
};
