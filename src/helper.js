
const BASE_URL = 'https://www.omdbapi.com/?apikey=e778c679';

export const request = async(url) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`);

    return response.json();
  } catch (e) {
    return false;
  }
};
