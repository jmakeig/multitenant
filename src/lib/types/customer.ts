export interface customer {
	id: string
	organization_id: string
	name: string
	email: string | null
	metadata: Record<string, unknown> | null
	created_at: Date
	updated_at: Date
}

export interface create_customer_input {
	name: string
	email?: string
	metadata?: Record<string, unknown>
}
