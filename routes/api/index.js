const router = require("express").Router();

router.use("/", require("./accounts"));
router.use("/", require("./groups"));
router.use("/", require("./restaurants"));
router.use("/", require("./movies"));
router.use("/", require("./destinations"));
router.use("/", require("./shows"));

module.exports = router;
