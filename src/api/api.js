const BASE_URL = 'https://www.omdbapi.com/?apikey=892b42fa';

const request = async(url) => {
  const response = await fetch(`${BASE_URL}${url}`);

  return response.json();
};

export const getFilm = title => request(`&t=${title}`);
