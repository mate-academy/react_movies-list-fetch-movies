const API_URL = 'https://www.omdbapi.com/?apikey=29a9cf6d&';

export const getData = async (title: string) => {
  const response = await fetch(`${API_URL}t=${title}`);

  return response.json();
};
