const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log('ENTROU');
  if (!req.files) {
    return res.status(500).send({ msg: "arquivo não foi encontrado" })
  }
  const myFile = req.files.file;

  myFile.mv(`${__dirname} / public / ${myFile.name}`, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send({ msg: "Ocorreu um erro" });
    }
    // retendo a resposta com o caminho e nome do arquivo
    return res.send({
      name: myFile.name, path: `/${myFile.name}`
    });
  });
})

module.exports = router;
