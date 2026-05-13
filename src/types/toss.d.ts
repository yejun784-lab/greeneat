// TossPayments v2 SDK type declarations
interface TossPaymentInstance {
  requestPayment(params: {
    method: '카드' | '계좌이체' | '가상계좌' | '휴대폰' | '문화상품권' | '도서문화상품권' | '게임문화상품권'
    amount: { currency: 'KRW'; value: number }
    orderId: string
    orderName: string
    customerName?: string
    customerEmail?: string
    customerMobilePhone?: string
    successUrl: string
    failUrl: string
    cardCompany?: string
    useEscrow?: boolean
    flowMode?: 'DEFAULT' | 'DIRECT'
    easyPay?: string
    country?: string
    taxFreeAmount?: number
    taxExemptionAmount?: number
    couponAmount?: number
    useCardPoint?: boolean
  }): Promise<void>
}

interface TossPaymentsSDK {
  payment(options: { customerKey: string }): TossPaymentInstance
}

type TossPaymentsFactory = (clientKey: string) => TossPaymentsSDK

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory
  }
}

export {}
