const express = require('express');
const app = express();

app.get('/test-log', (req, res) => {
  console.log('Mini app log!');
  res.send('Mini app!');
});

app.listen(4500, () => console.log('Mini app running on 4500'));