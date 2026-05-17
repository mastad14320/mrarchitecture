// ============================
// WHATSAPP CHECKOUT
// ============================

export function openWhatsAppOrder({

  customerName,
  customerPhone,
  transactionId,
  paymentMethod,
  total,
  items

}) {

  // ITEMS
  const itemsText =
    items.map((item, index) => {

      return `

${index + 1}. ${item.name}
Qty: ${item.quantity}
Price: UGX ${item.price.toLocaleString()}

`;

    }).join("");

  // MESSAGE
  const message = `

Hello MR Architecture,

I have placed an order.

====================

Customer Name:
${customerName}

Phone:
${customerPhone}

Payment Method:
${paymentMethod}

Transaction ID:
${transactionId}

====================

ORDER ITEMS:
${itemsText}

====================

TOTAL:
UGX ${total.toLocaleString()}

Please confirm my payment.

`;

  // NUMBER
  const phone =
    "256769370218";

  // URL
  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // OPEN
  window.open(
    url,
    "_blank"
  );

}