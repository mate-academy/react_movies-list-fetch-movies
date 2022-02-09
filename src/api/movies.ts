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

export function getMovie(addUrl: string): Promise<Movie> {
  // eslint-disable-next-line no-console
  console.log(`${API_URL}${addUrl}`);

  return fetch(`${API_URL}${addUrl}`)
    .then(response => {
      // eslint-disable-next-line no-console
      // console.log(response);

      // if (!response.ok) {
      //   throw new Error('error');
      // }

      // eslint-disable-next-line no-console
      // console.log(response.json());

      return response.json();
    // eslint-disable-next-line no-console
    }, (error) => console.log('error Url', error));
}
