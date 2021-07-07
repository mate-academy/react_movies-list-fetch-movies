const MOVIES_API = `https://www.omdbapi.com/?i=tt3896198&apikey=4b6ca699&t=`;

export const getMovie = async(title) => {
  const movie = await fetch(`${MOVIES_API}${title}`);

  return movie.json();
};
