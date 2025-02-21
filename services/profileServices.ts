import { ProfileData, MenuItem } from '../types/profile';

export const profileService = {
    getProfileData: async (): Promise<ProfileData> => {
        // This will be your actual API call
        const response = await fetch('/api/profile');
        return response.json();
    },
    
    getMenuItems: async (): Promise<MenuItem[]> => {
        // This could be from your API or could stay as local configuration
        // depending on your needs
        return [/* menu items */];
    }
};