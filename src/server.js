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
              return
            }

            const fromNodeModule = !babelPath.node.source.value.match(/^[./]/)
            if (fromNodeModule) {
              babelPath.node.source.value = '/__mokapack__/' + babelPath.node.source.value
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

app.use('/__mokapack__/*', (req, res) => {
  let relativeFilepath = req.baseUrl.replace(/__mokapack__/, '')
  let filepath = path.join(__dirname, '../node_modules', relativeFilepath)
  const extname = path.extname(req.baseUrl)
  if (!extname) {
    if (fs.existsSync(filepath)) {
      relativeFilepath += '/index.js'
    } else {
      relativeFilepath += '.js'
    }
  }
  filepath = path.join(__dirname, '../node_modules', relativeFilepath)

  const { code } = babel.transformFileSync(filepath, {
    plugins: [
      'transform-commonjs'
    ]
  })

  const { code: code2 } = babel.transformSync(code, {
    plugins: [
      {
        visitor: {
          ImportDeclaration(babelPath) {
            babelPath.node.source.value = path.join('/__mokapack__/', path.dirname(relativeFilepath), babelPath.node.source.value)
          }
        }
      }
    ]
  })

  res.set('Content-Type', 'text/javascript')
  res.status(200).send(code2)
})

app.use(express.static(path.join(__dirname, '../public')))

app.listen(5600)