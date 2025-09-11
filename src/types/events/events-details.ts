export type KeyValue = {
  key: string
  value: string
}

export interface EventDetails {
  id?: string
  social_links?: Array<KeyValue>
  media?: Array<KeyValue>
  sponsors?: Array<KeyValue>
  faqs?: Array<KeyValue>
  content?: string
  event_id: string
}
