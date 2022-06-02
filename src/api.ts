const URL = 'https://www.omdbapi.com/?apikey=29a9cf6d&';

export const getData = async (title: string) => {
  const response = await fetch(`${URL}t=${title}`);

  return response.json();
};
