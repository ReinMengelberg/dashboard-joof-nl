const { hash } = require('bcryptjs');

const plaintext = process.argv[2]; // e.g. "<YOUR_PASSWORD>"
const rounds = 12; // cost factor

if (!plaintext) {
    console.error('Usage: node hash-password.js "<YOUR_PASSWORD>"');
    process.exit(1);
}

hash(plaintext, rounds).then((hashed) => {
    console.log(hashed);
});
