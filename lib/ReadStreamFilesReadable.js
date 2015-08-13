import {
  Readable
}
from 'stream'
import dir from 'node-dir'

export default class extends Readable {
  constructor(dirname) {
    super({
      "objectMode": true
    })

    dir.readFiles(dirname, {
      match: /[Stream|index].js$/,
      exclude: /^\./
    }, (err, content, filename, next) => {
      if (err)
        throw err;

      this.push({
        filename: filename,
        content: content
      })
      next();
    });
  }
  _read() {}
}
