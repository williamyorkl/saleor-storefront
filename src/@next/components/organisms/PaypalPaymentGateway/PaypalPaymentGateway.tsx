import { useCart, useCheckout } from "@saleor/sdk";
import { ICheckout } from "@saleor/sdk/lib/api/Checkout/types";
import * as React from "react";
import { PayPalButton } from "react-paypal-button-v2";

import { PROVIDERS } from "@temp/core/config";

interface PaypalOrderParams {
  intent?: "CAPTURE" | "AUTHORIZE";
  // 关于"CAPTURE" | "AUTHORIZE": https://blog.csdn.net/milliemeter/article/details/51755335
  purchase_units: [
    {
      reference_id?: string;
      amount: {
        currency_code?: string;
        value: string;
      };
      payee?: {
        email_address: string | undefined;
        merchant_id?: string;
      };
      payment_instruction?: {
        platform_fees: [];
        disbursement_mode: string; // enum
      };
    }
  ];
  application_context?: {
    brand_name: string;
    locale: string;
    landing_page: string;
    shipping_preference: string;
    user_action: string;
    payment_method: {
      payer_selected: string;
      payee_preferred: "UNRESTRICTED" | "IMMEDIATE_PAYMENT_REQUIRED";
    };
    return_url: string;
    cancel_url: string;
  };
  payer?: {
    name?: {
      given_name: string;
      surname: string;
    };
    email_address?: string;
    birth_date?: string;
    tax_info?: {
      tax_id: string;
      tax_id_type: string; // enum
    };
    address?: {
      address_line_1: string | null | undefined;
      address_line_2: string | null | undefined;
      admin_area_2: string | null | undefined;
      admin_area_1: string | null | undefined;
      postal_code: string | null | undefined;
      country_code: string | null | undefined;
    };
  };
}

const checkoutToPaypalOrderParams = (
  // checkout: CheckoutInterface
  checkout: ICheckout | undefined,
  totalPrice: any
): PaypalOrderParams => {
  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: checkout?.id,
        amount: {
          value: totalPrice!.gross!.amount.toString(),
        },
        // 这里不设置也没毛病
        // payee: {
        //   email_address: "sb-agxgc15827471@business.example.com",
        //   merchant_id: "NYVVZNURDUVGU",
        // },
      },
    ],
    payer: {
      // name: {
      //   given_name: "",
      //   surname: "",
      // },
      email_address: checkout?.email,
      // birth_date: "",
      // tax_info: {
      //   tax_id: "",
      //   tax_id_type: "", // enum
      // },
      address: {
        address_line_1: checkout?.billingAddress?.streetAddress1,
        address_line_2: checkout?.billingAddress?.streetAddress2,
        admin_area_2: checkout?.billingAddress?.city,
        admin_area_1: checkout?.billingAddress?.countryArea,
        postal_code: checkout?.billingAddress?.postalCode,
        country_code: checkout?.billingAddress?.country?.code,
      },
    },
  };
};

const PaypalPaymentGateway = ({
  config,
  processPayment,
  submitPayment,
  submitPaymentSuccess,
}: any) => {
  const { totalPrice } = useCart();

  // console.log("🚀 ~ file: line 120 ~ totalPrice", totalPrice);

  const { checkout, availablePaymentGateways } = useCheckout();

  const gateway = availablePaymentGateways?.find(
    (pg: any) => pg.name === PROVIDERS.PAYPAL.label
  );

  const clientId = config.find((item: any) => item.field === "client_id").value;

  // console.log("🚀 ~ file: ~ line 124 ~ gateway", gateway);
  // console.log("🚀 ~ file: ~ line 132 ~ clientId", clientId);

  const createPaypalOrder = (data: any, actions: any) => {
    const orderArgs: PaypalOrderParams = checkoutToPaypalOrderParams(
      checkout,
      totalPrice
    );

    return actions.order.create(orderArgs);
  };

  // Through the server: authorize
  const onApprove = async (data: any) => {
    // console.log("====用户同意付款，付款已授权====");
    // console.log("line 145 ~ onApprove ~ data", data);

    const { facilitatorAccessToken, orderID } = data;

    console.log(
      "🚀 ~ file: PaypalPaymentGateway.tsx ~ line 149 ~ onApprove ~ facilitatorAccessToken",
      facilitatorAccessToken
    );

    // console.log("line 149 ~ onApprove ~ orderID, payerID", orderID, payerID);

    // processPayment calls the createPayment mutation
    await processPayment(gateway?.id, orderID);

    const payment = await submitPayment();

    await submitPaymentSuccess(payment?.order);
  };

  return (
    <div style={{ backgroundColor: "#eee", padding: 16, borderRadius: 4 }}>
      <PayPalButton
        amount={totalPrice?.net?.amount}
        options={{
          clientId,
          currency: totalPrice?.net?.currency || "USD",
          intent: "capture",
        }}
        createOrder={createPaypalOrder}
        onApprove={onApprove}
      />
    </div>
  );
};

export { PaypalPaymentGateway };
