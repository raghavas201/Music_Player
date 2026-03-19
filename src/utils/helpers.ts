export const getImageUrl = (images?: any[]) => {
  if (!images || images.length === 0) {
    return 'https://via.placeholder.com/300';
  }

  return (
    images[2]?.url ||
    images[2]?.link ||
    images[1]?.url ||
    images[1]?.link ||
    images[0]?.url ||
    images[0]?.link ||
    'https://via.placeholder.com/300'
  );
};