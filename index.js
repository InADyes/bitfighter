const express = require('express')
const app = express()

app.use(express.static('game/lib'))
app.use('/images', express.static('game/images'))

app.use('/settings', express.static('settings/lib'))

app.listen(3000, function () {
  console.log('listening on port 3000')
})