import through from 'through2'
import esprima from 'esprima'

export default through.obj(function(chunk, enc, callback) {
  this.push({
    filename: chunk.filename,
    ast: parseES6Module(chunk.content)
  })
  callback()
})

function parseES6Module(source) {
  return esprima.parse(
    source, {
      sourceType: 'module'
    }
  )
}
