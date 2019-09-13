const generator = require('generate-password');

function createPassword() {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  return password;
}

module.exports = {
  createPassword,
};
