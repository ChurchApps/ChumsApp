export * from "../appBase/interfaces";

export interface AnswerInterface { id?: number, value?: string, questionId?: number, formSubmissionId?: number }
export interface CampusInterface { id?: number, name?: string }
export interface ContactInfoInterface { address1?: string, address2?: string, city?: string, state?: string, zip?: string, homePhone?: string, mobilePhone?: string, workPhone?: string, email?: string }
export interface FormInterface { id?: number, name?: string, contentType?: string }
export interface FormSubmissionInterface { id?: number, formId?: number, contentType?: string, contentId?: number, form?: FormInterface, answers?: AnswerInterface[], questions?: QuestionInterface[] }
export interface GroupInterface { id?: number, name?: string, categoryName?: string, memberCount?: number, trackAttendance?: boolean, parentPickup?: boolean }
export interface GroupMemberInterface { id?: number, personId: number, person?: PersonInterface, groupId: number, group?: GroupInterface }
export interface GroupServiceTimeInterface { id?: number, groupId?: number, serviceTimeId?: number, serviceTime?: ServiceTimeInterface }
export interface HouseholdInterface { id?: number, name?: string }
export interface HouseholdMemberInterface { id?: number, householdId?: number, household?: HouseholdInterface, personId?: number, person?: PersonInterface, role?: string }
export interface NameInterface { first?: string, middle?: string, last?: string, nick?: string, display?: string }
export interface NoteInterface { id?: number, churchId?: number, contentType?: string, contentId?: number, noteType?: string, addedBy?: number, contents?: string, dateAdded?: string, person?: PersonInterface }
export interface ReportInterface { id?: number, keyName?: string, title?: string, query?: string, parameters?: string, reportType: string, columns?: ReportColumnInterface[], values?: ReportValueInterface[], results?: any[] }
export interface ReportColumnInterface { field?: string, heading?: string, grouped?: boolean, formatType?: string }
export interface ReportValueInterface { key?: string, value?: any }
export interface PersonInterface { id?: number, name: NameInterface, contactInfo: ContactInfoInterface, membershipStatus?: string, gender?: string, birthDate?: Date, maritalStatus?: string, anniversary?: Date, photo?: string, photoUpdated?: Date, householdId?: number, householdRole?: string, userId?: number, formSubmissions?: [FormSubmissionInterface] }
export interface QuestionInterface { id?: number, formId?: number, title?: string, fieldType?: string, placeholder?: string, description?: string, choices?: [{ value?: string, text?: string }] }
export interface RegisterInterface { churchName?: string, firstName?: string, lastName?: string, email?: string, password?: string }
export interface ServiceInterface { id?: number, campusId?: number, name?: string }
export interface ServiceTimeInterface { id?: number, name?: string, longName?: string, serviceId?: number }
export interface UserInterface { id?: number, name: string }

//Donation Api
export interface DonationBatchInterface { id?: number, name?: string, batchDate?: Date, donationCount?: number, totalAmount?: number }
export interface DonationInterface { id?: number, batchId?: number, personId?: number, donationDate?: Date, amount?: number, method?: string, methodDetails?: string, notes?: string, person?: PersonInterface, fund?: FundInterface }
export interface DonationSummaryInterface { week: number, donations?: DonationSummaryDonation[] }
export interface DonationSummaryDonation { totalAmount: number, fund?: FundInterface }
export interface FundInterface { id: number, name: string }
export interface FundDonationInterface { id?: number, donationId?: number, fundId?: number, amount?: number, donation?: DonationInterface }

//Attendance API
export interface AttendanceInterface { campus: CampusInterface, service: ServiceInterface, serviceTime: ServiceTimeInterface, groupId: number }
export interface AttendanceRecordInterface { serviceTime: ServiceTimeInterface, service: ServiceInterface, campus: CampusInterface, week: number, count: number, visitDate: Date, groupId: number }
export interface VisitInterface { id?: number, personId?: number, serviceId?: number, groupId?: number, visitDate?: Date, visitSessions?: VisitSessionInterface[], person?: PersonInterface }
export interface VisitSessionInterface { id?: number, visitId?: number, sessionId?: number, visit?: VisitInterface, session?: SessionInterface }
export interface SessionInterface { id: number, groupId: number, serviceTimeId: number, sessionDate: Date, displayName: string }
export interface SettingInterface { id?: number, keyName?: string, value?: string }