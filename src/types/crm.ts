export type UserRole = 'Admin' | 'Sales Manager' | 'Team Leader' | 'Sales Agent';

export type LeadSource = 
  | 'Facebook' 
  | 'Instagram' 
  | 'Website' 
  | 'WhatsApp' 
  | 'Phone Call' 
  | 'Referral' 
  | 'Property Portal' 
  | 'Walk-in';

export type LeadStatus = 
  | 'New Lead'
  | 'Contacted'
  | 'Interested'
  | 'Qualified'
  | 'Meeting Scheduled'
  | 'Site Visit'
  | 'Negotiation'
  | 'Reservation'
  | 'Closed Deal'
  | 'Follow-up Later'
  | 'Lost Lead';

export type UnitType = 
  | 'Apartment' 
  | 'Duplex' 
  | 'Chalet' 
  | 'Penthouse' 
  | 'Standalone Villa' 
  | 'Townhouse'
  | 'Commercial';

export type UnitAvailability = 'Available' | 'Reserved' | 'Sold' | 'On Hold';

export type FollowUpType = 
  | 'Phone Call' 
  | 'WhatsApp' 
  | 'Meeting' 
  | 'Site Visit' 
  | 'Send Offer' 
  | 'Contract Follow-up';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type CallStatus = 'Answered' | 'No Answer' | 'Busy' | 'Call Back Later';

export type MeetingType = 'Online Meeting' | 'Office Meeting' | 'Site Visit';

export type LossReason = 
  | 'Price' 
  | 'No Response' 
  | 'Competitor' 
  | 'Location' 
  | 'Payment Plan' 
  | 'Not Ready' 
  | 'Invalid Lead' 
  | 'Changed Decision';

export interface ActivityTimelineItem {
  id: string;
  type: 'call' | 'whatsapp' | 'note' | 'meeting' | 'followup' | 'status_change' | 'offer' | 'reservation';
  title: string;
  description: string;
  timestamp: string; // ISO or formatted
  agentName: string;
  metadata?: Record<string, any>;
}

export interface Lead {
  id: string;
  clientName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  leadSource: LeadSource;
  campaign: string;
  interestedProject: string;
  unitType: UnitType;
  preferredLocation: string;
  budget: number; // in EGP
  paymentPreference: 'Cash' | 'Installments (3-5 yrs)' | 'Installments (6-8 yrs)' | 'Long-term (9+ yrs)';
  leadStatus: LeadStatus;
  assignedSalesAgent: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  nextFollowUpTime?: string;
  notes: string;
  createdAt: string;
  lossReason?: LossReason;
  lossNotes?: string;
  timeline: ActivityTimelineItem[];
  score?: number; // 0-100 buying probability
}

export interface Unit {
  id: string;
  unitCode: string;
  projectId: string;
  projectName: string;
  location: string;
  unitType: UnitType;
  area: number; // in sqm
  bedrooms: number;
  bathrooms: number;
  floor: number;
  view: string;
  price: number; // in EGP
  downPayment: number; // in EGP
  installmentYears: number;
  availability: UnitAvailability;
  features?: string[];
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  location: string;
  projectType: string;
  description: string;
  availableUnits: number;
  totalUnits: number;
  startingPrice: number; // in EGP
  paymentPlans: string;
  deliveryDate: string;
  imageUrl?: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  interestedProject: string;
  assignedAgent: string;
  followUpDate: string;
  followUpTime: string;
  followUpType: FollowUpType;
  priority: Priority;
  notes: string;
  status: 'Pending' | 'Completed' | 'Rescheduled';
}

export interface SalesAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  team: string;
  assignedLeads: number;
  callsMade: number;
  followUpsCompleted: number;
  meetings: number;
  siteVisits: number;
  reservations: number;
  closedDeals: number;
  salesValue: number; // in EGP
  targetValue: number;
  conversionRate: number; // in %
}

export interface CallRecord {
  id: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  salesAgent: string;
  callDate: string;
  callTime: string;
  durationSeconds: number;
  callStatus: CallStatus;
  callNotes: string;
  nextAction: string;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  salesAgent: string;
  timestamp: string;
  templateType: 'custom' | 'brochure' | 'payment_plan' | 'location' | 'followup' | 'recommended_units';
  messageText: string;
  status: 'Sent' | 'Delivered' | 'Read';
}

export interface Task {
  id: string;
  taskTitle: string;
  taskType: 'Call Client' | 'Send Offer' | 'Schedule Meeting' | 'Arrange Site Visit' | 'Send Contract' | 'Follow-up Payment';
  leadId?: string;
  clientName?: string;
  assignedEmployee: string;
  deadline: string;
  priority: Priority;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}

export interface Meeting {
  id: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  salesAgent: string;
  project: string;
  meetingType: MeetingType;
  date: string;
  time: string;
  location: string;
  notes: string;
  meetingResult?: 'Attended - High Interest' | 'Attended - Follow-up Required' | 'Postponed' | 'Cancelled' | 'Converted to Reservation';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Reservation {
  id: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  project: string;
  unitCode: string;
  salesAgent: string;
  unitPrice: number;
  reservationAmount: number;
  reservationDate: string;
  paymentStatus: 'Paid' | 'Pending Deposit' | 'Bank Transfer Pending';
  reservationStatus: 'Active' | 'Converted to Deal' | 'Cancelled / Refunded';
}

export interface Deal {
  id: string;
  reservationId?: string;
  leadId: string;
  clientName: string;
  clientPhone: string;
  project: string;
  unitCode: string;
  salesAgent: string;
  dealValue: number;
  commission: number; // calculated e.g. 2%
  closingDate: string;
  dealStatus: 'Signed & Active' | 'Contract Under Review' | 'Completed';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'lead_assigned' | 'followup_due' | 'overdue' | 'reservation' | 'deal' | 'uncontacted' | 'visit_reminder';
  read: boolean;
  leadId?: string;
}
