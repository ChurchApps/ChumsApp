export * from "../appBase/interfaces";
export interface ColumnInterface { header: string, value: string, formatter: string }
export interface ReportResultInterface { displayName: string, description: string, tables: { keyName: string, data: any[] }[], columns: ColumnInterface[] }