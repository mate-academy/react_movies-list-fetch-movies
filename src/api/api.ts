const apiUrl = 'https://www.omdbapi.com/?apikey=64ad9fc9';

// export const getMovie = async (title: string) => {
//   const response = await fetch(`${apiUrl}&t=$${title}`);
//   const resultData = await response.json();
//
//   if (resultData.Response === 'False') {
//     throw new Error('error');
//   }
//
//   return resultData;
// };

export const getMovie = (title: string) => {
  return fetch(`${apiUrl}&t=$${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('error');
      }

      return response.json();
    });
};
