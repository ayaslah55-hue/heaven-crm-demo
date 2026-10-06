import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Lead, Project, Unit, FollowUp, SalesAgent, CallRecord, 
  WhatsAppMessage, Task, Meeting, Reservation, Deal, 
  NotificationItem, UserRole, LeadStatus, Priority, ActivityTimelineItem, LossReason
} from '../types/crm';
import { translations, Language } from '../i18n/translations';
import { 
  mockProjects, mockUnits, mockSalesAgents, mockLeads, 
  mockFollowUps, mockReservations, mockDeals, mockCalls, 
  mockWhatsAppMessages, mockTasks, mockMeetings, mockNotifications 
} from '../data/mockData';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  team: string;
}

interface CrmContextType {
  // Localization
  lang: Language;
  toggleLanguage: () => void;
  t: typeof translations['ar'];
  dir: 'rtl' | 'ltr';

  // Auth & Roles
  isAuthenticated: boolean;
  currentUser: UserProfile;
  login: (email?: string, password?: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Active navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'timeline'>) => void;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  reviveLead: (leadId: string) => void;
  addTimelineItem: (leadId: string, item: Omit<ActivityTimelineItem, 'id' | 'timestamp'>) => void;
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  isLeadProfileOpen: boolean;
  setIsLeadProfileOpen: (open: boolean) => void;
  openLeadProfile: (lead: Lead) => void;

  // Modals
  isNewLeadModalOpen: boolean;
  setIsNewLeadModalOpen: (open: boolean) => void;
  callModalLead: Lead | null;
  openCallModal: (lead: Lead) => void;
  closeCallModal: () => void;
  whatsappModalLead: Lead | null;
  openWhatsAppModal: (lead: Lead) => void;
  closeWhatsAppModal: () => void;

  // Projects & Inventory
  projects: Project[];
  units: Unit[];
  updateUnitAvailability: (unitId: string, availability: Unit['availability']) => void;

  // Follow-ups
  followUps: FollowUp[];
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  completeFollowUp: (id: string) => void;
  rescheduleFollowUp: (id: string, newDate: string, newTime: string) => void;

  // Sales Agents
  salesAgents: SalesAgent[];

  // Calls (Sales Reports & Calls)
  calls: CallRecord[];
  logCall: (call: Omit<CallRecord, 'id'>) => void;

  // WhatsApp
  whatsappMessages: WhatsAppMessage[];
  logWhatsAppMessage: (msg: Omit<WhatsAppMessage, 'id'>) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskStatus: (id: string) => void;

  // Meetings
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeetingStatus: (id: string, status: Meeting['status'], result?: Meeting['meetingResult']) => void;

  // Reservations & Deals
  reservations: Reservation[];
  deals: Deal[];
  addReservation: (res: Omit<Reservation, 'id'>) => void;
  convertToDeal: (reservationId: string, dealValue: number, commissionPercent?: number) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Auto Lead Distribution Simulation
  simulateLeadDistribution: (campaignSource: string, clientName: string, project: string, budget: number) => Promise<{ assignedAgent: string; leadId: string }>;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const roleProfiles: Record<UserRole, UserProfile> = {
  'Admin': {
    name: 'Eng. Karim El-Sayed',
    email: 'karim.admin@heaven-re.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    team: 'Executive Board'
  },
  'Sales Manager': {
    name: 'Tarek Mansour',
    email: 'tarek.manager@heaven-re.com',
    role: 'Sales Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    team: 'Sales Operations'
  },
  'Team Leader': {
    name: 'Sara Mohamed',
    email: 'sara.mohamed@heaven-re.com',
    role: 'Team Leader',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    team: 'North Coast & Luxury Alexandria'
  },
  'Sales Agent': {
    name: 'Ahmed Salah',
    email: 'ahmed.salah@heaven-re.com',
    role: 'Sales Agent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    team: 'North Coast & Luxury Alexandria'
  }
};

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // start logged in for instant preview
  const [currentUser, setCurrentUser] = useState<UserProfile>(roleProfiles['Sales Manager']);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Leads
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadProfileOpen, setIsLeadProfileOpen] = useState<boolean>(false);

  // Modals
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState<boolean>(false);
  const [callModalLead, setCallModalLead] = useState<Lead | null>(null);
  const [whatsappModalLead, setWhatsAppModalLead] = useState<Lead | null>(null);

  // Data collections
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps);
  const [salesAgents, setSalesAgents] = useState<SalesAgent[]>(mockSalesAgents);
  const [calls, setCalls] = useState<CallRecord[]>(mockCalls);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>(mockWhatsAppMessages);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Sync HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = translations[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const login = (_email?: string, _password?: string, role: UserRole = 'Sales Manager') => {
    setCurrentUser(roleProfiles[role] || roleProfiles['Sales Manager']);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser(roleProfiles[role] || roleProfiles['Sales Agent']);
  };

  const openLeadProfile = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadProfileOpen(true);
  };

  const openCallModal = (lead: Lead) => {
    setCallModalLead(lead);
  };

  const closeCallModal = () => {
    setCallModalLead(null);
  };

  const openWhatsAppModal = (lead: Lead) => {
    setWhatsAppModalLead(lead);
  };

  const closeWhatsAppModal = () => {
    setWhatsAppModalLead(null);
  };

  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'timeline'>) => {
    const id = `lead-${Date.now()}`;
    const nowStr = new Date().toISOString().split('T')[0];
    const newLead: Lead = {
      ...newLeadData,
      id,
      createdAt: nowStr,
      score: Math.floor(Math.random() * 25) + 70, // 70-95%
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: 'status_change',
          title: 'Lead Created in Heaven CRM',
          description: `Captured from ${newLeadData.leadSource} (${newLeadData.campaign || 'Direct'}). Assigned to ${newLeadData.assignedSalesAgent}.`,
          timestamp: `${nowStr} 10:00 AM`,
          agentName: currentUser.name
        }
      ]
    };

    setLeads((prev) => [newLead, ...prev]);

    // Also schedule follow-up automatically
    const newFollowUp: FollowUp = {
      id: `fu-${Date.now()}`,
      leadId: id,
      clientName: newLead.clientName,
      clientPhone: newLead.mobileNumber,
      interestedProject: newLead.interestedProject,
      assignedAgent: newLead.assignedSalesAgent,
      followUpDate: newLead.nextFollowUpDate || nowStr,
      followUpTime: newLead.nextFollowUpTime || '11:00 AM',
      followUpType: 'Phone Call',
      priority: 'High',
      notes: 'Initial outreach for newly registered inquiry.',
      status: 'Pending'
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Lead Registered',
      description: `Client "${newLead.clientName}" registered for ${newLead.interestedProject}.`,
      timestamp: 'Just now',
      type: 'lead_assigned',
      read: false,
      leadId: id
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updatedTimeline: ActivityTimelineItem[] = [
            {
              id: `t-${Date.now()}`,
              type: 'status_change',
              title: `Stage Changed to: ${newStatus}`,
              description: `Lead moved from "${l.leadStatus}" to "${newStatus}" by ${currentUser.name}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              agentName: currentUser.name
            },
            ...l.timeline
          ];
          return { ...l, leadStatus: newStatus, timeline: updatedTimeline };
        }
        return l;
      })
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, leadStatus: newStatus } : null);
    }
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLead?.id === leadId) {
      setIsLeadProfileOpen(false);
      setSelectedLead(null);
    }
  };

  const reviveLead = (leadId: string) => {
    updateLeadStatus(leadId, 'Interested');
    updateLead(leadId, { lossReason: undefined, lossNotes: undefined });
  };

  const addTimelineItem = (leadId: string, item: Omit<ActivityTimelineItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityTimelineItem = {
      ...item,
      id: `t-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            timeline: [newItem, ...l.timeline]
          };
        }
        return l;
      })
    );

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => prev ? { ...prev, timeline: [newItem, ...prev.timeline] } : null);
    }
  };

  const updateUnitAvailability = (unitId: string, availability: Unit['availability']) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, availability } : u))
    );
  };

  const addFollowUp = (fu: Omit<FollowUp, 'id'>) => {
    const newFu: FollowUp = { ...fu, id: `fu-${Date.now()}` };
    setFollowUps((prev) => [newFu, ...prev]);
  };

  const completeFollowUp = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Completed' } : f))
    );
  };

  const rescheduleFollowUp = (id: string, newDate: string, newTime: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, followUpDate: newDate, followUpTime: newTime, status: 'Pending' } : f
      )
    );
  };

  const logCall = (callData: Omit<CallRecord, 'id'>) => {
    const newCall: CallRecord = {
      ...callData,
      id: `call-${Date.now()}`
    };
    setCalls((prev) => [newCall, ...prev]);

    // Also update agent call stats
    setSalesAgents((prev) =>
      prev.map((ag) =>
        ag.name === callData.salesAgent ? { ...ag, callsMade: ag.callsMade + 1 } : ag
      )
    );

    // Sync to lead timeline
    addTimelineItem(callData.leadId, {
      type: 'call',
      title: `Call: ${callData.callStatus} (${Math.round(callData.durationSeconds / 60)} min)`,
      description: `${callData.callNotes}. Next action: ${callData.nextAction}`,
      agentName: callData.salesAgent
    });
  };

  const logWhatsAppMessage = (msgData: Omit<WhatsAppMessage, 'id'>) => {
    const newMsg: WhatsAppMessage = {
      ...msgData,
      id: `wa-${Date.now()}`
    };
    setWhatsappMessages((prev) => [newMsg, ...prev]);

    // Sync to lead timeline
    addTimelineItem(msgData.leadId, {
      type: 'whatsapp',
      title: `WhatsApp: ${msgData.templateType.toUpperCase()}`,
      description: msgData.messageText,
      agentName: msgData.salesAgent
    });
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: `task-${Date.now()}` };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: next };
        }
        return t;
      })
    );
  };

  const addMeeting = (m: Omit<Meeting, 'id'>) => {
    const newM: Meeting = { ...m, id: `m-${Date.now()}` };
    setMeetings((prev) => [newM, ...prev]);

    // Sync timeline
    addTimelineItem(m.leadId, {
      type: 'meeting',
      title: `${m.meetingType} Scheduled`,
      description: `Date: ${m.date} at ${m.time} - Location: ${m.location}. Notes: ${m.notes}`,
      agentName: m.salesAgent
    });
  };

  const updateMeetingStatus = (id: string, status: Meeting['status'], result?: Meeting['meetingResult']) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status, meetingResult: result || m.meetingResult } : m))
    );
  };

  const addReservation = (resData: Omit<Reservation, 'id'>) => {
    const newRes: Reservation = { ...resData, id: `res-${Date.now()}` };
    setReservations((prev) => [newRes, ...prev]);

    // Mark unit reserved
    const targetUnit = units.find((u) => u.unitCode === resData.unitCode);
    if (targetUnit) {
      updateUnitAvailability(targetUnit.id, 'Reserved');
    }

    // Update lead status
    updateLeadStatus(resData.leadId, 'Reservation');

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Reservation Deposit Logged',
        description: `${resData.reservationAmount.toLocaleString()} EGP received from ${resData.clientName} for ${resData.unitCode}.`,
        timestamp: 'Just now',
        type: 'reservation',
        read: false,
        leadId: resData.leadId
      },
      ...prev
    ]);
  };

  const convertToDeal = (reservationId: string, dealValue: number, commissionPercent: number = 2) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    // Update reservation status
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, reservationStatus: 'Converted to Deal' } : r))
    );

    // Create deal
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      reservationId,
      leadId: res.leadId,
      clientName: res.clientName,
      clientPhone: res.clientPhone,
      project: res.project,
      unitCode: res.unitCode,
      salesAgent: res.salesAgent,
      dealValue,
      commission: Math.round(dealValue * (commissionPercent / 100)),
      closingDate: new Date().toISOString().split('T')[0],
      dealStatus: 'Signed & Active'
    };
    setDeals((prev) => [newDeal, ...prev]);

    // Update unit to Sold
    const targetUnit = units.find((u) => u.unitCode === res.unitCode);
    if (targetUnit) {
      updateUnitAvailability(targetUnit.id, 'Sold');
    }

    // Update lead to Closed Deal
    updateLeadStatus(res.leadId, 'Closed Deal');

    // Update sales agent stats
    setSalesAgents((prev) =>
      prev.map((ag) =>
        ag.name === res.salesAgent
          ? {
              ...ag,
              closedDeals: ag.closedDeals + 1,
              salesValue: ag.salesValue + dealValue,
              conversionRate: Number(((ag.closedDeals + 1) / ag.assignedLeads * 100).toFixed(1))
            }
          : ag
      )
    );

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Official Deal Closed!',
        description: `Contract finalized for ${dealValue.toLocaleString()} EGP (${res.unitCode}) by ${res.salesAgent}.`,
        timestamp: 'Just now',
        type: 'deal',
        read: false,
        leadId: res.leadId
      },
      ...prev
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Simulator for Automatic Lead Assignment
  const simulateLeadDistribution = async (
    campaignSource: string,
    clientName: string,
    project: string,
    budget: number
  ): Promise<{ assignedAgent: string; leadId: string }> => {
    // Pick agent with lowest assigned leads for fair round robin
    const sortedAgents = [...salesAgents].sort((a, b) => a.assignedLeads - b.assignedLeads);
    const chosenAgent = sortedAgents[0] || salesAgents[0];

    const newLeadId = `lead-sim-${Date.now()}`;
    const nowStr = new Date().toISOString().split('T')[0];

    const createdLead: Lead = {
      id: newLeadId,
      clientName,
      mobileNumber: `+20 100 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      whatsappNumber: `+20 100 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `${clientName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      leadSource: campaignSource as any,
      campaign: `${campaignSource} Automated Ingestion Engine`,
      interestedProject: project,
      unitType: budget > 7000000 ? 'Duplex' : 'Apartment',
      preferredLocation: project.includes('North Coast') ? 'North Coast' : 'Alexandria',
      budget,
      paymentPreference: 'Installments (6-8 yrs)',
      leadStatus: 'New Lead',
      assignedSalesAgent: chosenAgent.name,
      lastContactDate: nowStr,
      nextFollowUpDate: nowStr,
      nextFollowUpTime: '11:00 AM',
      notes: `Auto-assigned via CRM Distribution Engine to ${chosenAgent.name}. SLA: First call required within 15 mins.`,
      createdAt: nowStr,
      score: 82,
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: 'status_change',
          title: `Lead Auto-Captured from ${campaignSource}`,
          description: `System matched and allocated prospect to ${chosenAgent.name} (Round-robin balancing).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentName: 'System Bot'
        }
      ]
    };

    setLeads((prev) => [createdLead, ...prev]);

    // Update agent assigned count
    setSalesAgents((prev) =>
      prev.map((ag) => (ag.id === chosenAgent.id ? { ...ag, assignedLeads: ag.assignedLeads + 1 } : ag))
    );

    // Auto schedule urgent 15-minute follow-up
    const autoFollowUp: FollowUp = {
      id: `fu-${Date.now()}`,
      leadId: newLeadId,
      clientName,
      clientPhone: createdLead.mobileNumber,
      interestedProject: project,
      assignedAgent: chosenAgent.name,
      followUpDate: nowStr,
      followUpTime: 'Within 15 mins',
      followUpType: 'Phone Call',
      priority: 'Urgent',
      notes: 'SLA: First discovery outreach for incoming digital lead.',
      status: 'Pending'
    };
    setFollowUps((prev) => [autoFollowUp, ...prev]);

    // Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Lead Auto-Assigned',
        description: `Lead "${clientName}" assigned to ${chosenAgent.name}. Follow-up scheduled.`,
        timestamp: 'Just now',
        type: 'lead_assigned',
        read: false,
        leadId: newLeadId
      },
      ...prev
    ]);

    return { assignedAgent: chosenAgent.name, leadId: newLeadId };
  };

  return (
    <CrmContext.Provider
      value={{
        lang,
        toggleLanguage,
        t,
        dir,
        isAuthenticated,
        currentUser,
        login,
        logout,
        switchRole,
        activeTab,
        setActiveTab,
        leads,
        addLead,
        updateLeadStatus,
        updateLead,
        deleteLead,
        reviveLead,
        addTimelineItem,
        selectedLead,
        setSelectedLead,
        isLeadProfileOpen,
        setIsLeadProfileOpen,
        openLeadProfile,
        isNewLeadModalOpen,
        setIsNewLeadModalOpen,
        callModalLead,
        openCallModal,
        closeCallModal,
        whatsappModalLead,
        openWhatsAppModal,
        closeWhatsAppModal,
        projects,
        units,
        updateUnitAvailability,
        followUps,
        addFollowUp,
        completeFollowUp,
        rescheduleFollowUp,
        salesAgents,
        calls,
        logCall,
        whatsappMessages,
        logWhatsAppMessage,
        tasks,
        addTask,
        toggleTaskStatus,
        meetings,
        addMeeting,
        updateMeetingStatus,
        reservations,
        deals,
        addReservation,
        convertToDeal,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        simulateLeadDistribution
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = (): CrmContextType => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
