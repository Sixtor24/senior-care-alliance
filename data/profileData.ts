import { ProfileData } from '../types/profile';
import { ProfileMenuItem } from '../components/ProfileMenu';

// Mock profile data
export const profileData: ProfileData = {
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    profileImage: require('../assets/images/profile.svg')
};

// Mock menu items with placeholder actions
export const menuItems: ProfileMenuItem[] = [
    {
        id: 'team',
        label: 'Team',
        onPress: () => console.log('Team clicked')
    },
    {
        id: 'settings',
        label: 'Settings',
        onPress: () => console.log('Settings clicked')
    },
    {
        id: 'logout',
        label: 'Logout',
        onPress: () => console.log('Logout clicked')
    }
];