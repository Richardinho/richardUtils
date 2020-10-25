function arrayPush(array, value) {
  return [...array, value];
}

function arraySplice(array, index) {
  return array.filter((_, i) => {
    return index !== i; 
  });
}

exports.arraySplice = arraySplice;
exports.arrayPush = arrayPush;


