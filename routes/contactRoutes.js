const express = require('express')
const router = express.Router();

const {getContacts, updateContact, getContact, deleteContact, createContact} = require('../controllers/contactController');
const validateToken = require('../middlewares/validateTokenHandler');


router.use(validateToken)
router.route('/').get(getContacts).post(createContact)

router.route('/:id').put(updateContact).delete(deleteContact).get(getContact)



module.exports = router;