import sass from "node-sass";

const preProcessor = (data, filename) => {
  return sass.renderSync({
    data,
    file: filename,
    indentedSyntax: true,
    outputStyle: 'compressed'
  }).css.toString('utf8')
}

export default preProcessor;