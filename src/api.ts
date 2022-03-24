const API_KEY = '&apikey=a552bcb7';
const API_SERVER = 'https://www.omdbapi.com/';

const wait = (delay: number) => new Promise(reslove => setTimeout(reslove, delay));

export const request = async (movieTitle: string) => {
  await wait(1000);
  const response = await fetch(`${API_SERVER}?t=${movieTitle}${API_KEY}`);

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};
