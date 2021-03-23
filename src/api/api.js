const key = 'dae19b6e';

const BASE__URL = `https://www.omdbapi.com/?apikey=${key}&`;

export const request = async(title) => {
  const response = await fetch(`${BASE__URL}t=${title}`);

  try {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.status.text}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};
