export const getMax = array => array.reduce((count, res) => { 
  return Math.max(res, count);
}, 0);