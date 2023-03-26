export const checkImageUrl = (url: string) => {
  if (url === 'N/A') {
    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }

  return url;
};
