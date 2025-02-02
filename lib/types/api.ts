export interface ApiKey {
    key: string;
    name: string;
    createdAt: Date;
    lastUsed?: Date;
}

export interface ApiKeyResponse {
    key: string;
    name: string;
}

export interface ApiError {
    error: string;
    details?: string;
}
