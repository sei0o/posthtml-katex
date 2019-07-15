'use strict'

const katex = require('katex')
const parser = require('posthtml-parser')
const AsciiMathParser = require('./asciimath2tex')

// todo: asciimath compatible

module.exports = options => {
  const amParser = new AsciiMathParser()

  return tree => {
    tree.match({attrs: {class: 'latex'}}, node => {
      if (node.content) {
        node.content = node.content.map(c => {
          if (typeof c !== 'string') return c

          const replaced = c
            .replace(/\`((.|[\r\n])+?)\`/gm, (match, capture) => amParser.parse(capture))

          return parser(katex.renderToString(replaced, {displayMode:true}))
        })
      }

      return node
    })

    tree.walk(node => {
      if (node.content) {
        node.content = node.content.map(c => {
          if (typeof c !== 'string') return c

          const replaced = c
            // .replace(/\$\$((.|[\r\n])*?)\`((.|[\r\n])+?)\`((.|[\r\n])*?)\$\$/gm, (match, p1, p2, p3, p4, p5, p6) => `1:${p1} 2:${p2} 3:${p3} 4:${p4} 5:${p5} 6:${p6} ${arguments} ${Object.keys(arguments)} $$ ${p1} ${amParser.parse(p3)} ${p5} $$ `)
            .replace(/\`\`((.|[\r\n])+?)\`\`/gm, (match, capture) => katex.renderToString(amParser.parse(capture), {displayMode: true}))
            .replace(/\`((.|[\r\n])+?)\`/gm, (match, capture) => katex.renderToString(amParser.parse(capture), {displayMode: false}))
            .replace(/\$\$((.|[\r\n])+?)\$\$/gm, (match, capture) => katex.renderToString(capture, {displayMode: true}))
            .replace(/\$((.|[\r\n])+?)\$/gm, (match, capture) => katex.renderToString(capture, {displayMode: false}))

          // const replaced = c
          //   .replace(/\`\`((.|[\r\n])+?)\`\`/gm, (match, capture) => `$$ ${amParser.parse(capture)} $$`)
          //   .replace(/\`((.|[\r\n])+?)\`/gm, (match, capture) => `$ ${amParser.parse(capture)} $`)

          return parser(replaced)
        })
      }

      return node
    })
    
    return tree
  }
}