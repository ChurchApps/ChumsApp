export interface ReportHeadingInterface { name: string, field: string }
export interface ReportInterface { title: string, keyName: string, reportType: string, headings: ReportHeadingInterface[], data: any[], groupings: string[] }
export interface ReportFilterInterface { fields: ReportFilterFieldInterface[], keyName: string }
export interface ReportFilterFieldInterface { keyName: string, displayName: string, dataType: string, value: any, options?: () => ReportFilterOptionInterface[] }
export interface ReportFilterOptionInterface { keyName: string, value: string, label: string }
