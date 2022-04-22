import React from "react";

import { ErrorMessage, Radio } from "@components/atoms";
import { PROVIDERS } from "@temp/core/config";

import {
  AdyenPaymentGateway,
  BraintreePaymentGateway,
  DummyPaymentGateway,
  PaypalPaymentGateway,
  StripePaymentGateway,
} from "..";
import * as S from "./styles";
import { IProps } from "./types";

/**
 * Payment Gateways list
 */
const PaymentGatewaysList: React.FC<IProps> = ({
  paymentGateways,
  // 设置默认收款方式是 paypal
  selectedPaymentGateway = "mirumee.payments.paypal",
  selectedPaymentGatewayToken,
  selectPaymentGateway,
  formRef,
  formId,
  processPayment,
  submitPayment,
  submitPaymentSuccess,
  errors,
  onError,
}: IProps) => {
  return (
    <S.Wrapper>
      {paymentGateways.map(({ id, name, config }, index) => {
        const checked = selectedPaymentGateway === id;

        switch (name) {
          case PROVIDERS.BRAINTREE.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-test="checkoutPaymentGatewayBraintreeInput"
                    name="payment-method"
                    value="credit-card"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel
                  >
                    <span data-test="checkoutPaymentGatewayBraintreeName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <BraintreePaymentGateway
                    config={config}
                    formRef={formRef}
                    formId={formId}
                    processPayment={(token, cardData) =>
                      processPayment(id, token, cardData)
                    }
                    errors={errors}
                    onError={onError}
                  />
                )}
              </div>
            );

          // NOTE - DUMMY付款方式只是用于测试购物流程而已
          case PROVIDERS.DUMMY.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-test="checkoutPaymentGatewayDummyInput"
                    name="payment-method"
                    value="dummy"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel
                  >
                    <span data-test="checkoutPaymentGatewayDummyName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <DummyPaymentGateway
                    formRef={formRef}
                    formId={formId}
                    processPayment={token => processPayment(id, token)}
                    initialStatus={selectedPaymentGatewayToken}
                  />
                )}
              </div>
            );

          case PROVIDERS.STRIPE.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-test="checkoutPaymentGatewayStripeInput"
                    name="payment-method"
                    value="stripe"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel
                  >
                    <span data-test="checkoutPaymentGatewayStripeName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <StripePaymentGateway
                    config={config}
                    formRef={formRef}
                    formId={formId}
                    processPayment={(token, cardData) =>
                      processPayment(id, token, cardData)
                    }
                    submitPayment={submitPayment}
                    submitPaymentSuccess={submitPaymentSuccess}
                    errors={errors}
                    onError={onError}
                  />
                )}
              </div>
            );

          case PROVIDERS.ADYEN.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-test="checkoutPaymentGatewayAdyenInput"
                    name="payment-method"
                    value="adyen"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel
                  >
                    <span data-test="checkoutPaymentGatewayAdyenName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <AdyenPaymentGateway
                    config={config}
                    formRef={formRef}
                    scriptConfig={PROVIDERS.ADYEN.script}
                    styleConfig={PROVIDERS.ADYEN.style}
                    processPayment={() => processPayment(id)}
                    submitPayment={submitPayment}
                    submitPaymentSuccess={submitPaymentSuccess}
                    errors={errors}
                    onError={onError}
                  />
                )}
              </div>
            );

          case PROVIDERS.PAYPAL.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-test="checkoutPaymentGatewayPaypalInput"
                    name="payment-method"
                    value="paypal"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel
                  >
                    <span data-test="checkoutPaymentGatewayPaypalName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <PaypalPaymentGateway
                    config={config}
                    formRef={formRef}
                    processPayment={processPayment}
                    submitPayment={submitPayment}
                    submitPaymentSuccess={submitPaymentSuccess}
                    errors={errors}
                    onError={onError}
                  />
                )}
              </div>
            );

          default:
            return null;
        }
      })}
      {!selectedPaymentGateway && errors && <ErrorMessage errors={errors} />}
    </S.Wrapper>
  );
};

export { PaymentGatewaysList };
