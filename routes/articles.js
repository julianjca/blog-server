const router = require('express').Router();
const { create,findAll,remove,update,findOne } = require('../controllers/articleController');
const { auth } = require('../middlewares/auth');

router.post('/', auth, create);
router.get('/', findAll);
router.delete('/:id',auth, remove);
router.put('/:id', auth, update);
router.get('/:id', findOne);

module.exports = router;