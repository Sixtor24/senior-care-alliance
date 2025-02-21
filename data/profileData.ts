import { ProfileData, MenuItem } from '../types/profile';

// Mock profile data
export const profileData: ProfileData = {
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    profileImage: require('../assets/images/profile.svg')
};

// Mock menu items with placeholder actions
export const menuItems: MenuItem[] = [
    {
        label: "Manage Team",
        onPress: () => {
            console.log("Manage Team clicked");
            // Will be replaced with actual API call or navigation
        }
    },
    {
        label: "Settings",
        onPress: () => {
            console.log("Settings clicked");
            // Will be replaced with actual API call or navigation
        }
    },
    {
        label: "Logout",
        onPress: () => {
            console.log("Logout clicked");
            // Will be replaced with actual API call or navigation
        }
    }
];