import { PermissionInterface } from ".";

export * from "../appBase/interfaces";
export interface ReportResultInterface { displayName: string, description: string, tables: { keyName: string, data: any[] }[], columns: ColumnInterface[] }
export interface ReportInterface { keyName: string, displayName: string, description: string, parameters: ParameterInterface[], permissions: PermissionInterface[] }
export interface ParameterInterface { keyName: string, displayName?: string, source: string, sourceKey: string, options: { value: string, text: string }[], value?: string }
export interface ColumnInterface { header: string, value: string, formatter: string }
