export interface PaymentGatewaysInterface { id?: string, churchId?: string, provider?: string, publicKey?: string, privateKey?: string, payFees?: boolean }

export interface PlanInterface { id?: string, churchId?:string, name?: string, serviceDate?: Date, notes?: string }
export interface PositionInterface { id?: string, churchId?:string, planId?:string, categoryName?:string, name?: string, count?:number, groupId?:string }
export interface AssignmentInterface { id?: string, churchId?:string, positionId?:string, personId?:string }
export interface TimeInterface { id?: string, churchId?:string, planId?:string, displayName?:string, startTime?:Date, endTime?:Date, teams?:string, teamList?:string[] }
