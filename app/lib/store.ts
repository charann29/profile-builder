import { create } from 'zustand';
import { ProfileData } from './schema';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

interface ProfileState {
    profileData: Partial<ProfileData>;
    messages: Message[];
    isTyping: boolean;
    setProfileData: (data: Partial<ProfileData>) => void;
    updateProfileField: (field: keyof ProfileData, value: unknown) => void;
    addMessage: (message: Message) => void;
    setIsTyping: (isTyping: boolean) => void;
    resetChat: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profileData: {
        fullName: '',
        expertiseAreas: [],
        topHighlights: [],
        achievements: [],
        socialLinks: {
            linkedin: '',
        },
        workExperienceType: 'Multiple',
        brands: [],
        contact: {
            emailPrimary: '',
            emailShow: true,
            phoneShow: true,
            whatsappShow: true,
            addressShow: true,
        },
    },
    messages: [
        {
            text: "I'm here to craft your professional profile. Share your details, and watch your document come to life on the right.",
            sender: 'bot',
        },
    ],
    isTyping: false,

    setProfileData: (data) =>
        set((state) => ({
            profileData: { ...state.profileData, ...data },
        })),

    updateProfileField: (field, value) =>
        set((state) => ({
            profileData: { ...state.profileData, [field]: value },
        })),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    setIsTyping: (isTyping) => set({ isTyping }),

    resetChat: () => set({ messages: [], isTyping: false }),
}));
