export interface ProfileData {
    userName: string;
    userEmail: string;
    profileImage: any; // This will be replaced with proper image type when connected to API
}

export interface MenuItem {
    label: string;
    onPress: () => void;
}