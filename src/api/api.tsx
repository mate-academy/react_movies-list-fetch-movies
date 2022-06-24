const url = 'http://www.omdbapi.com/?i=tt3896198&apikey=4e13cbeb';

export const request = (title: string) => {
  return fetch(`${url}&t=[${title}]`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Loading error...');
      }

      return res.json();
    });
};
