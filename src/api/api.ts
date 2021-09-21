export const url = 'https://www.omdbapi.com/?apikey=750c80fc';

export const loadMovie = async (title: string) => {
  const response = await fetch(`${url}&t=${title}`);

  return response.json();
};
