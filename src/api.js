// const MOVIES_URL = `http://www.omdbapi.com/?apikey=6b42759e&i=tt3896198`;
const MOVIES_URL = `http://www.omdbapi.com/?apikey=6b42759e`;

export async function getMovie(title) {
  const response = await fetch(`${MOVIES_URL}&t=${title}`);

  if (response.status === 200) {
    return response.json();
  }

  throw new Error(response.status);
}

// export function getMovie(title) {
//   return fetch(`${MOVIES_URL}&t=${title}`)
//     .then(resp => resp.json());
// }
