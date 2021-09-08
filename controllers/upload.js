const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// router.post('/', upload.array('file'), async (req, res) => {
//   console.log(`Files received: ${req.files.length}`);
//   res.send({
//     upload: true,
//     files: req.files,
//   });
// });



module.exports = { upload }
