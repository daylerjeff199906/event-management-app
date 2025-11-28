'use server'
import { getSupabase } from './core.supabase'
import { EventActivityForm } from "@/modules/events/schemas";
import { EventActivity } from "@/types";
import { revalidatePath } from 'next/cache'

