const fs = require('fs');
const code = fs.readFileSync('d:/FITCHECK/index.js', 'utf8');
const match = code.match(/baseURL:.*?['"](.*?)['"]/g);
console.log(match);
