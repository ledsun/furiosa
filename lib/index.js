import through from 'through2'
import path from 'path'
import fs from 'fs'
import split from 'split'

import ReadStreamFilesReadable from './ReadStreamFilesReadable'
import StdinReadable from './StdinReadable'
import esprimaStream from './esprimaStream'
import parseActionSteram from './parseActionSteram'

let [dir, stream] = init()

stream
  .pipe(esprimaStream)
  .pipe(parseActionSteram)
  .pipe(through.obj(function(chunk, enc, callback) {
    // ファイル名を相対パスで表示
    this.push({
      filename: path.relative(dir, chunk.filename),
      actions: chunk.actions
    })
    callback()
  }))
  .pipe(through.obj(function(chunk, enc, callback) {
    // JSONを整形
    this.push(JSON.stringify(chunk, null, 4))
    callback()
  }))
  .pipe(process.stdout)

function init() {
  if (process.argv[2]) {
    // 引数があるときは、指定ディレクトリ配下のファイルを対象にします。
    dir = process.argv[2]

    return [dir, new ReadStreamFilesReadable(dir)]
  } else {
    // 引数が無いときは標準入力から入力されたファイル名を対象にします。
    dir = process.cwd()

    return [dir, new StdinReadable(dir)]
  }
}
