export * from "../appBase/interfaces";
export interface ReportResultInterface { displayName: string, description: string, table: any[], outputs: ReportOutputInterface[] }
export interface ReportInterface { keyName: string, displayName: string, description: string, parameters: ParameterInterface[], permissions: ReportPermissionGroupInterface[] }
export interface ParameterInterface { keyName: string, displayName?: string, source: string, sourceKey: string, options: { value: string, text: string }[], value?: string, requiredParentIds?: string[], defaultValue: string }
export interface ReportOutputInterface { outputType: string, columns: ColumnInterface[], groupings?: number[] }
export interface ColumnInterface { header: string, value: string, formatter: string }
export interface ReportPermissionGroupInterface { requireOne: ReportPermissionInterface[] }
export interface ReportPermissionInterface { api: string, contentType: string, action: string }