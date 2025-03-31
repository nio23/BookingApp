import { Member } from "./member"

export interface Appointment {
    id?: number
    date: Date
    canUpdateOrDelete?: boolean
    user?: Member
    clientName?: string
}