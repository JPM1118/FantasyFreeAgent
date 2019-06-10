
const formatJson = (obj) => {
  const colorize = require('json-colorizer')
  return console.log(colorize(JSON.stringify(obj, null, '  ')));
}

module.exports = formatJson
