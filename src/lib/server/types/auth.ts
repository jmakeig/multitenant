import type { customer, create_customer_input } from '../../types/customer'

export interface credentials {
	username: string
	password: string
}

export interface auth_provider {
	authenticate(creds: credentials): Promise<{ organization_id: string }>
}

export interface session {
	readonly organization_id: string
	create_customer(input: create_customer_input): Promise<customer>
	list_customers(): Promise<customer[]>
}
