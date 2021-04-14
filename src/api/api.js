const BASE_URL = 'https://www.omdbapi.com/?apikey=39e399d8&t=';

export const request = async(title) => {
  const response = await fetch(`${BASE_URL}${title}`);

  return response.json();
};
