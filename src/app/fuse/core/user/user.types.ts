export interface User
{
    uid: string;
    username: string;
    hashedPassword: string;
    full_name: string;
    email: string;
    avatar?: string;
    status?: string;
    password_changed_at?: string;
    created_at?: string;
    is_email_verified?: boolean;
    roles: UserRoles;
}

export interface UserRoles
{
    admin: boolean;
    accountant: boolean;
    manager: boolean;
    user: boolean;    
}