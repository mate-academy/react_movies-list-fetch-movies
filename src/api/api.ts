const API = 'https://www.omdbapi.com/?apikey=224b6ad3&';

export const request = async (title: string) => {
  const response = await fetch(`${API}t=${title}`);

  return response.json();
};
