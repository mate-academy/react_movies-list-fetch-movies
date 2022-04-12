const API_URL = 'https://www.omdbapi.com/?apikey=304877e5';

export const loadData = async (query: string) => {
  const data = await fetch(`${API_URL}&t=${query}`);

  return data.json();
};
