const URL = 'https://www.omdbapi.com/?apikey=7942a07a&t=';

export const getMovie = async(title) => {
  const response = await fetch(`${URL}${title}`);

  try {
    return response.json();
  } catch (error) {
    return Promise.reject(new Error(error));
  }
};
