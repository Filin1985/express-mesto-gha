const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getUserProfile);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
