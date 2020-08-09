const path = require('path')
const fs = require('fs')
const express = require('express')
const babel = require('@babel/core')

function cssLoader(filepath) {
  return `
  (function() {
    var node = document.createElement('style')
    node.innerText = \`${fs.readFileSync(filepath, 'utf-8')}\`
    document.body.append(node)
  }())
  `
}

const app = express()

app.use('/client/*', (req, res) => {
  const filepath = path.join(__dirname, req.baseUrl)
  const { code } = babel.transformFileSync(filepath, {
    plugins: [
      {
        visitor: {
          ImportDeclaration(babelPath) {
            const extname = path.extname(babelPath.node.source.value)
            if (extname === '.css') {
              const cssFilepath = path.join(path.dirname(filepath), babelPath.node.source.value)
              babelPath.replaceWithSourceString(cssLoader(cssFilepath))
            }
          }
        }
      },
      'transform-commonjs'
    ]
  })

  res.set('Content-Type', 'text/javascript')
  res.status(200).send(code)
})

app.use(express.static(path.join(__dirname, '../public')))

app.listen(5600)