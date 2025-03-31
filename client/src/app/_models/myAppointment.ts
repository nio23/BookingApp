import { Member } from "./member"

export interface MyAppointment {
    id: number
    date: Date
    canUpdateOrDelete: boolean
    clientName?: string
    user: Member
}