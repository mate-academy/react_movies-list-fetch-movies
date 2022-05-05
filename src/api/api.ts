const BASE_URL = 'https://www.omdbapi.com/?apikey=6fc09e40';

export const getData = async (url:string) => {
  try {
    const response = await fetch(`${BASE_URL}&t=[${url}]`);

    return await response.json();
  } catch (error) {
    return 'Not find movie';
  }
};
