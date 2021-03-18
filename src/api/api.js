const key = 'dae19b6e';

const BASE__URL = `http://www.omdbapi.com/?apikey=${key}&`;

export const request = async(title) => {
  const response = await fetch(`${BASE__URL}t=${title}`);

  return response.json();
};
