const express = require("express");

const { asyncHandler } = require("../../commons/helps/asyncHandler");
const { payWithoutWebhooks } = require("../../controllers/payment.controller");

const router = express.Router();

router.post("/pay-without-webhooks", asyncHandler(payWithoutWebhooks))

module.exports = router