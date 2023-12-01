const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const {auth} = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
  
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/:username/profile',auth, UserController.profile);
router.get('/home',auth, UserController.home);
router.delete('/delete',auth, UserController.delete);
router.get('/settings',auth, UserController.getSettings)
router.patch('/settings',auth, UserController.updateSettings);
router.patch('/settings/password',auth, UserController.changePassword);
router.post('/review/:id/report',auth, UserController.reportReview)
//router.post('/forgotPassword', UserController.forgotPassword);
//router.post('/reset-password/:token', UserController.resetPassword);
router.get('/logout',auth, UserController.logout)
router.post('/:username/upload', auth, upload.single('avatar'), UserController.uploadAvatar);

module.exports = router;