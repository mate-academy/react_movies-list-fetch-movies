// eslint-disable-next-line
const API_URL = `https://www.omdbapi.com/?i=tt3896198&apikey=8327dd52&t=`;

// export function getCurrentMovie(userId: number): Promise<Movie[]> {
//   return fetch(`${API_URL}/users/${userId}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('error download user');
//       }

//       return response.json();
//     });
// }

export async function getMovie(addUrl: string): Promise<Movie> {
  // eslint-disable-next-line no-console
  console.log(`${API_URL}${addUrl}`);

  const response = await fetch(`${API_URL}${addUrl}`);

  //  eslint-disable-next-line no-console
  console.log('response', response);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.log('test');

    throw new Error('error');
  }

  return response.json();

  //   .then(response => {
  //   // eslint-disable-next-line no-console
  //   // console.log(response);

  //   if (!response.ok) {
  //     throw new Error('error');
  //   }

  //   return response.json();
  // // eslint-disable-next-line no-console
  // }, (error) => console.log('error Url', error));
}
