import { Role, UserStatus } from "@prisma/client"

export interface UserProps {
    id: string
    role_id: string
    name: string
    email: string | null
    phone_number: string
    avatar?: string | null
    status: UserStatus
    password: string
    created_at: Date
    updated_at: Date
    role: Role
}