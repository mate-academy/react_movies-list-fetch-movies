const API_KEY = process.env.REACT_APP_API_KEY;

export const getMovie = async (title: string) => {
  console.log(API_KEY);
  const responce = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`,
  );

  return responce.json();
};
