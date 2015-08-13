import through from 'through2'
import fs from 'fs'
import split from 'split'

export default function(dir) {
  process.stdin.setEncoding('utf-8')
  let stream = process.stdin
    .pipe(split())
    .pipe(through.obj(function(chunk, enc, callback) {
      if (chunk && chunk.endsWith('.js')) {
        // ファイルの中身の読み込む
        let filename = dir + '/' + chunk

        fs.readFile(filename, (err, data) => {
          if (err) {
            // 削除されたファイルを指定されることがあるので、ファイルが無い時は無視する
            if (err.code !== 'ENOENT')
              throw err

          } else {
            this.push({
              filename: filename,
              content: data
            })
          }

          // async call
          callback()
        })
      } else {
        callback()
      }
    }))

  return stream
}
