import through from 'through2'

export default through.obj(function(chunk, enc, callback) {
  let actions = parseAction(chunk.ast)

  if (actions.length) {
    this.push({
      filename: chunk.filename,
      actions: actions
    })
  }

  callback()
})

function parseAction(ast) {
  return ast.body
    .filter(b => b.declaration)
    .filter(b => b.declaration.type === 'ClassDeclaration')
    .filter(b => b.declaration.superClass && b.declaration.superClass.name === 'ActionTransform')
    .map(b => b.declaration.body.body[0])
    .filter(b => b.type === 'MethodDefinition' && b.key.name === 'constructor')
    .map(b => b.value.body.body)
    .reduce((a, b) => a = b, [])
    .filter(b => b.type === 'ExpressionStatement' && b.expression.type === 'CallExpression')
    .map(b => b.expression)
    .filter(b => b.callee.property && b.callee.property.name === 'bindActions')
    .map(b => {
      let target = b.arguments[0],
        handlers1 = b.arguments[1],
        handlers2 = ''

      if (handlers1.elements) {
        // ハンドラー配列を指定
        handlers2 = handlers1.elements.map(h => {
          let type = h.elements[0],
            handler1 = h.elements[1],
            handler2 = ''

          if (handler1.type === 'Identifier') {
            handler2 = handler1.name
          } else if (handler1.type === 'ArrowFunctionExpression') {
            handler2 = '--- ArrowFunction --->'
          }
          // 頑張ればpushしているところを見つけられそうだけど、関数呼んでたら追いかけられるのかな？
          // 動的に決まったり外部から設定される可能性がある

          return {
            type: `${type.object.name}.${type.property.name}`,
            handler: handler2
          }
        })
      } else {
        // 配列を返す関数よびだし
        handlers2 = `${handlers1.callee.name}(${handlers1.arguments[0].name})`
      }

      return {
        'target': `${target.object.name}.${target.property.name}`,
        'types': handlers2,
      }
    })
}
