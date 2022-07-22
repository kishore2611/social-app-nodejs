// const multer  = require('multer')

// // app.post('/profile', upload.single('avatar'), function (req, res, next) {
// //     // req.file is the `avatar` file
// //     // req.body will hold the text fields, if there were any
// //   })

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//     //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, Date.now() + '-' + file.originalname )
//     }
//   })

// const upload = multer({ storage: storage })




// module.exports = {
//     upload
// }


const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname == "profilePicture") {
        cb(null, "./uploads/profile/");
      }
      if (file.fieldname == "product_images") {
        cb(null, "./uploads/product/");
      }
      if (file.fieldname == "category_image") {
        cb(null, "./uploads/category/");
      }
      if (file.fieldname == "hf_images[]") {
        cb(null, "./uploads/feedback/");
      }
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    cb(null, true);
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  });

  module.exports = {
    upload
}