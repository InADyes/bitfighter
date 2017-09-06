const express = require('express')
const app = express()

app.use(express.static('index/', [{dotfiles: 'allow'}]))

//app.use('/settings', express.static('settings/', [{dotfiles: 'allow'}]));

app.listen(3000, function () {
  console.log('listening on port 3000')
})
