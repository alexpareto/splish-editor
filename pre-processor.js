const sass = require('node-sass')

const preProcessor = (data, filename) => {
  return sass.renderSync({
    data,
    file: filename,
    indentedSyntax: false,
    outputStyle: 'compressed'
  }).css.toString('utf8')
}

export default preProcessor;