const router = require('express').Router();
const { create,findAll,remove,update } = require('../controllers/commentController');
const { auth } = require('../middlewares/auth');


router.post('/',auth, create);
router.get('/', findAll);
// router.get('/:id', findOne);
router.delete('/:id',auth, remove);
router.put('/:id',auth, update);

module.exports = router;