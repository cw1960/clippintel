import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
  value?: number;
  deadline?: Date;
  status: 'new' | 'reviewed' | 'applied' | 'rejected';
  matchScore: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OpportunityState {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    status: string | null;
    minScore: number;
    searchTerm: string;
  };
  fetchOpportunities: () => Promise<void>;
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  setFilters: (filters: Partial<OpportunityState['filters']>) => void;
  clearFilters: () => void;
}

export const useOpportunityStore = create<OpportunityState>()(
  subscribeWithSelector((set, get) => ({
    opportunities: [],
    isLoading: false,
    error: null,
    filters: {
      category: null,
      status: null,
      minScore: 0,
      searchTerm: '',
    },
    fetchOpportunities: async () => {
      set({ isLoading: true, error: null });
      try {
        // Mock data for development
        const mockOpportunities: Opportunity[] = [
          {
            id: '1',
            title: 'Grant for AI Research',
            description: 'Funding opportunity for artificial intelligence research projects',
            source: 'Government',
            url: 'https://example.com/grant-1',
            category: 'Technology',
            value: 50000,
            deadline: new Date('2024-06-01'),
            status: 'new',
            matchScore: 85,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            title: 'Small Business Innovation Award',
            description: 'Award for innovative small business solutions',
            source: 'Private Foundation',
            url: 'https://example.com/award-1',
            category: 'Business',
            value: 25000,
            deadline: new Date('2024-05-15'),
            status: 'new',
            matchScore: 92,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        set({ opportunities: mockOpportunities, isLoading: false });
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
        set({ error: 'Failed to fetch opportunities', isLoading: false });
      }
    },
    addOpportunity: (opportunityData) => {
      const newOpportunity: Opportunity = {
        ...opportunityData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set((state) => ({
        opportunities: [...state.opportunities, newOpportunity],
      }));
    },
    updateOpportunity: (id, updates) => {
      set((state) => ({
        opportunities: state.opportunities.map((opp) =>
          opp.id === id ? { ...opp, ...updates, updatedAt: new Date() } : opp,
        ),
      }));
    },
    deleteOpportunity: (id) => {
      set((state) => ({
        opportunities: state.opportunities.filter((opp) => opp.id !== id),
      }));
    },
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      }));
    },
    clearFilters: () => {
      set({
        filters: {
          category: null,
          status: null,
          minScore: 0,
          searchTerm: '',
        },
      });
    },
  }))
);
