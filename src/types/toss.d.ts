// 토스페이먼츠 타입 정의 (모의 구현)
interface TossPaymentsWidgets {
  setAmount(params: { currency: string; value: number }): Promise<void>
  renderPaymentMethods(params: { selector: string; variantKey?: string }): Promise<void>
  renderAgreement(params: { selector: string; variantKey?: string }): Promise<void>
  requestPayment(params: {
    orderId: string
    orderName: string
    successUrl: string
    failUrl: string
    customerEmail?: string
    customerName?: string
  }): Promise<void>
}

interface TossPayment {
  requestPayment(params: {
    method: string
    amount: { currency: string; value: number }
    orderId: string
    orderName: string
    customerName?: string
    customerEmail?: string
    successUrl: string
    failUrl: string
    easyPay?: { provider: string }
  }): Promise<void>
}

interface TossPaymentsInstance {
  widgets(params: { customerKey: string }): TossPaymentsWidgets
  payment(params: { customerKey: string }): TossPayment
}

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPaymentsInstance
  }
}

export {}