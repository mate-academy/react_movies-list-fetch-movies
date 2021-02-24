const BASE_URL = 'https://www.omdbapi.com/?apikey=471d12fb&t=';

export const request = (url, options) => (fetch(`${BASE_URL}${url}`, options)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    return response.json();
  })
);

export const getMovie = async(title) => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
