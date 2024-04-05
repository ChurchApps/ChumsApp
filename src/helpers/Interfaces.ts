export interface PaymentGatewaysInterface { id?: string, churchId?: string, provider?: string, publicKey?: string, privateKey?: string, payFees?: boolean }

export interface BlockoutDateInterface { id?: string; churchId?: string; personId?: string; startDate?: Date; endDate?: Date; }
