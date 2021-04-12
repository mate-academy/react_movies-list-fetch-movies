const key = '6ae5f894';

const BASE_URL = `https://www.omdbapi.com/?apikey=${key}&t=`;

export const request = async(title) => {
  const response = await fetch(`${BASE_URL}${title}`);

  try {
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};
