import { createPaymentSession } from "~/payments.repository";

/**
 * Saves and starts a payment session.
 * Redirects back to shop if payment session was created.
 */
export const action = async ({ request }) => {
  // Parse the request body to get the necessary data
  const requestBody = await request.json();

  // Get the Shopify shop domain from the request headers
  const shopDomain = request.headers.get("shopify-shop-domain");

  // Create a payment session using the provided request parameters and shop domain
  const paymentSession = await createPaymentSession(createParams(requestBody, shopDomain));

  // If the payment session couldn't be created, return an error
  if (!paymentSession) throw new Response("A PaymentSession couldn't be created.", { status: 500 });

  // If successful, return the redirect URL to the payment simulator
  return { "redirect_url": buildRedirectUrl(request, paymentSession.id) };
}

/**
 * Helper function to create parameters for the payment session.
 */
const createParams = ({ id, gid, group, amount, currency, test, kind, customer, payment_method, proposed_at, cancel_url }, shopDomain) => (
  {
    id,
    gid,
    group,
    amount,
    currency,
    test,
    kind,
    customer,
    paymentMethod: payment_method,
    proposedAt: proposed_at,
    cancelUrl: cancel_url,
    shop: shopDomain
  }
)

/**
 * Helper function to build the redirect URL.
 */
const buildRedirectUrl = (request, id) => {
  return `${request.url.slice(0, request.url.lastIndexOf("/"))}/payment_simulator/${id}`
}

