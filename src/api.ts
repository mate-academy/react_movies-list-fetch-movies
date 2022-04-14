const URL = 'https://www.omdbapi.com/?apikey=65141f58&t=';

export const requestFromServer = (title: string) => {
  return fetch(`${URL}${title}`).then(data => data.json());
};
