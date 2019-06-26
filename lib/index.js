'use strict'

const katex = require('katex')
const parser = require('posthtml-parser')
const AsciiMathParser = require('./asciimath2tex')

// todo: asciimath compatible

module.exports = options => {
  const amParser = new AsciiMathParser()

  return tree => {
    tree.walk(node => {
      if (node.content) {
        node.content = node.content.map(c => {
          if (typeof c !== 'string') return c
          
          const replaced = c
            .replace(/\`\`((.|[\r\n])+?)\`\`/gm, (match, capture) => katex.renderToString(amParser.parse(capture), {displayMode: true}))
            .replace(/\`((.|[\r\n])+?)\`/gm, (match, capture) => katex.renderToString(amParser.parse(capture), {displayMode: false}))
            .replace(/\$\$((.|[\r\n])+?)\$\$/gm, (match, capture) => katex.renderToString(capture, {displayMode: true}))
            .replace(/\$((.|[\r\n])+?)\$/gm, (match, capture) => katex.renderToString(capture, {displayMode: false}))

          return parser(replaced)
        })
      }

      return node
    })
    
    return tree
  }
}