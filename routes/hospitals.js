const express = require('express')
const router = express.Router();
const controller = require('../controllers/hospitals')


router.route('/').get(controller.getHospitals)
                 .post(controller.createHospital)

router.route('/:id').get(controller.getHospital)
                    .put(controller.updateHospital)
                    .delete(controller.deleteHospital)


module.exports = router