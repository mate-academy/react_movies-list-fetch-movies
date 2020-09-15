const URL_API = 'http://www.omdbapi.com/';

export function getInfo(title) {
  return fetch(`${URL_API}?apikey=d905f6c1&t=${title}`)
    .then(response => response.json());
}

// export const getInfo = async(title) => {
//   const movie = await fetch(`${URL_API}?apikey=d905f6c1&t=${title}`);

//   return movie.json();
// };
