const router = require('express').Router();

router.use('/', require('./accounts'));
router.use('/', require('./groups'));
router.use('/', require('./restaurants'));
router.use('/', require('./movies'));
router.use('/', require('./destinations'));
router.use('/', require('./shows'));

router.use((err, req, res, next) => {
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
