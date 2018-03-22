const fs = require('fs')

const pac = fs.readFileSync('./addon/url_db.json')
const template = fs.readFileSync('./src/common/black_hole.js')

const output = `const urlDb = ${pac};\n${template}`

fs.writeFileSync('./addon/pac/index.js', output)
