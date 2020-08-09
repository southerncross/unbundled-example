const { hello } = require('./b.js')
import './c.css'
import lodash from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'

console.log(lodash.now())

console.log('a')

hello()

ReactDOM.render(
  <div>Hello, World!</div>,
  document.getElementById('app')
)