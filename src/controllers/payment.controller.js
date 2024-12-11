require("dotenv").config();

const Stripe = require("stripe");
const { generateResponse } = require("../commons/utils");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";

const itemIdToPrice = {
  "id-1": 1400,
  "id-2": 2000,
  "id-3": 3000,
  "id-4": 4000,
  "id-5": 5000,
};

const calculateOrderAmount = (itemIds = ["id-1"]) => {
  const total = itemIds
    .map((id) => itemIdToPrice[id])
    .reduce((prev, curr) => prev + curr, 0);

  return total;
};

function getKeys(payment_method) {
  let secret_key = stripeSecretKey;
  let publishable_key = stripePublishableKey;

  switch (payment_method) {
    case "grabpay":
    case "fpx":
      publishable_key = "STRIPE_PUBLISHABLE_KEY_MY";
      secret_key = "STRIPE_SECRET_KEY_MY";
      break;
    case "au_becs_debit":
      publishable_key = "STRIPE_PUBLISHABLE_KEY_AU";
      secret_key = "STRIPE_SECRET_KEY_AU";
      break;
    case "oxxo":
      publishable_key = "STRIPE_PUBLISHABLE_KEY_MX";
      secret_key = "STRIPE_SECRET_KEY_MX";
      break;
    case "wechat_pay":
      publishable_key = "STRIPE_PUBLISHABLE_KEY_WECHAT";
      secret_key = "STRIPE_SECRET_KEY_WECHAT";
      break;
    case "paypal":
      publishable_key = "STRIPE_PUBLISHABLE_KEY_UK";
      secret_key = "STRIPE_SECRET_KEY_UK";
      break;
    default:
      publishable_key = "STRIPE_PUBLISHABLE_KEY";
      secret_key = "STRIPE_SECRET_KEY";
  }

  return { secret_key, publishable_key };
}

const payWithoutWebhooks = async (req, res) => {
  const {
    paymentMethodId,
    paymentIntentId,
    items,
    currency,
    useStripeSdk,
    cvcToken,
    email,
  } = req.body;

  const orderAmount = calculateOrderAmount(items);
  const { secret_key } = getKeys();

  const stripe = new Stripe(secret_key, {
    apiVersion: "2024-11-20.acacia",
    typescript: false,
  });

  try {
    if (cvcToken && email) {
      const customers = await stripe.customers.list({ email });

      if (!customers.data[0]) {
        return res.send({
          error:
            "There is no associated customer object to the provided e-mail",
        });
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customers.data[0].id,
        type: "card",
      });

      if (!paymentMethods.data[0]) {
        return res.send({
          error: `There is no associated payment method to the provided customer's e-mail`,
        });
      }

      const params = {
        amount: orderAmount,
        confirm: true,
        confirmation_method: "manual",
        currency,
        payment_method: paymentMethods.data[0].id,
        payment_method_options: {
          card: {
            cvc_token: cvcToken,
          },
        },
        use_stripe_sdk: useStripeSdk,
        customer: customers.data[0].id,
        return_url: "stripe-example://stripe-redirect",
      };

      const intent = await stripe.paymentIntents.create(params);
      return res.send(generateResponse(intent));
    } else if (paymentMethodId) {
      const params = {
        amount: orderAmount,
        confirm: true,
        confirmation_method: "manual",
        currency,
        payment_method: paymentMethodId,
        use_stripe_sdk: useStripeSdk,
        return_url: "stripe-example://stripe-redirect",
      };
      const intent = await stripe.paymentIntents.create(params);
      return res.send(generateResponse(intent));
    } else if (paymentIntentId) {
      const intent = await stripe.paymentIntents.confirm(paymentIntentId);
      return res.send(generateResponse(intent));
    }

    return res.sendStatus(400);
  } catch (e) {
    return res.send({ error: e.message });
  }
};

module.exports = { payWithoutWebhooks };
