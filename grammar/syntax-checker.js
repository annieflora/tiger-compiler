const fs = require('fs');
const ohm = require('ohm-js');

const grammar = ohm.grammar(fs.readFileSync('../tiger.ohm'));

module.exports = (text) => {
  return grammar.match(text).succeeded();
};
