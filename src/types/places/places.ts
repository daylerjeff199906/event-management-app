// src/types/places/places.ts

export interface OpeningHour {
    // ISO weekday name or number (e.g. "monday" or 1)
    day: string;
    // times as "HH:MM" or full ISO time strings
    open?: string | null;
    close?: string | null;
    // true when open 24h
    open24?: boolean;
    // true when closed the whole day
    closed?: boolean;
    notes?: string | null;
}

export interface AdmissionFee {
    // e.g. "adult", "child", "student"
    category?: string | null;
    // numeric value (stored as numeric in DB)
    amount?: number | null;
    currency?: string | null;
    description?: string | null;
}

export type SocialLinks = Record<string, string | null>;

/**
 * Represents a row from public.places
 * Field names match the DB column names (snake_case).
 */
export interface Place {
    id: string;
    created_at: string; // ISO timestamp
    updated_at?: string | null;

    name: string;
    description?: string | null;
    short_description?: string | null;
    type: string;

    cover_image_url?: string | null;
    // gallery_urls is JSONB in DB; commonly an array of image URLs
    gallery_urls?: string[] | null;

    video_url?: string | null;
    website_url?: string | null;

    contact_phone?: string | null;
    contact_email?: string | null;

    // social_links is JSONB; use a flexible record type
    social_links?: SocialLinks | null;

    // opening_hours is JSONB; commonly an array of OpeningHour entries
    opening_hours?: OpeningHour[] | OpeningHour | null;

    // admission_fees is JSONB; commonly an array of AdmissionFee entries
    admission_fees?: AdmissionFee[] | AdmissionFee | null;

    // features is JSONB; could be array of strings or structured object
    features?: string[] 

    tags?: string[] | null;

    average_rating?: number | null; // numeric(3,2)
    review_count?: number | null;
    popularity_score?: number | null;

    status?: 'active' | 'inactive' | string | null;
    verified?: boolean | null;

    address_id?: string | null;
    institution_id?: string | null;
    author_id?: string | null;
}