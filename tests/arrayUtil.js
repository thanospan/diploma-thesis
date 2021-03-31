'use strict';

const arrayUtil = require('../utils/array');

const array1 = ['1', '2', 'asdf', 'a1s2', '1', 'asdf', 'zxcv', 'qwer', 'a1s2'];
console.log('array1:');
console.log(array1);
const array2 = ['1', '2', 'asdf', 'a1s2', 'zxcv', 'qwer'];
console.log('array2:');
console.log(array2);

console.log('Remove duplicate elements from array 1:');
console.log(arrayUtil.removeDuplicates(array1));

console.log('Check if array1 is equal to array2:');
console.log(arrayUtil.areEqual(array1, array2));

console.log('Check if array1 without duplicate elements is equal to array2:');
console.log(arrayUtil.areEqual(arrayUtil.removeDuplicates(array1), array2));
