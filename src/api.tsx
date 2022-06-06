const BASE_URL = 'https://www.omdbapi.com/?apikey=cdb6ba9a&t=';

const getData = (url: string) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => response.json());
};

export const getFilm = async (title: string) => {
  const data = await getData(title);

  return data;
};
