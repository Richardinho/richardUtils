
function updateArray(array, index, value) {
  return array.map((currentVal, currentIndex) => {
    if (index === currentIndex) {
      return value;
    }

    return currentVal;
  });
}

function removeItemFromArray(array, index) {
  return array.filter((_, currentIndex) => {
    return index !== currentIndex; 
  });
}
