import { CompleteCheckout_checkoutComplete_order } from "@saleor/sdk/lib/mutations/gqlTypes/CompleteCheckout";

import {
  ICardData,
  IFormError,
  IPaymentGateway,
  IPaymentSubmitResult,
} from "@types";

export interface IProps {
  /**
   * Available payment gateways.
   */
  paymentGateways: IPaymentGateway[];
  /**
   * Selected payment gateway.
   */
  selectedPaymentGateway?: string;
  /**
   * Selected payment gateway token.
   */
  selectedPaymentGatewayToken?: string;
  /**
   * Called when selected payment gateway is changed.
   */
  selectPaymentGateway: (paymentGateway: string) => void;
  /**
   * Form reference on which payment might be submitted.
   */
  formRef?: React.RefObject<HTMLFormElement>;
  /**
   * Form id on which payment might be submitted.
   */
  formId?: string;
  /**
   * Payment gateway errors.
   */
  errors?: IFormError[];
  /**
   * Method called after the form is submitted. Passed gateway id and token attribute will be used to create payment.
   */
  processPayment: (
    gateway: string,
    token?: string,
    cardData?: ICardData
  ) => void;

  /**
   * 提交 payment
   */
  submitPayment: (data?: object) => Promise<IPaymentSubmitResult>;

  /**
   * payment 成功
   */
  submitPaymentSuccess: (
    order?: CompleteCheckout_checkoutComplete_order | null
  ) => void;
  /**
   * Method called when gateway error occured.
   */
  onError: (errors: IFormError[]) => void;
}
