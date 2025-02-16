import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Definición de tipos
interface DropdownItem {
    label: string;
    value: string;
}

interface CareDropdownProps {
    placeholder: string;
    items: DropdownItem[];
    onSelect: (value: string | null) => void; 
    error?: boolean; 
}

const CareDropdown: React.FC<CareDropdownProps> = ({
    placeholder,
    items,
    onSelect,
    error = false, 
}) => {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string | null>(null); 

    return (
        <>
            {/* Dropdown */}
            <DropDownPicker
                open={open}
                value={selectedRole} 
                items={items}
                setOpen={setOpen}
                setValue={setSelectedRole} 
                placeholder={placeholder}
                dropDownDirection="BOTTOM" 
                listMode="SCROLLVIEW"
                style={{
                    borderColor: error ? "#FF0000" : "#D1D5DB", 
                    borderWidth: 1,
                    height: 45,
                    minHeight: 40,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingRight: 15,
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                }}
                ArrowDownIconComponent={() => (
                    <FontAwesome6 name="chevron-down" size={14} color="#C5C5C5" />
                )}
                ArrowUpIconComponent={() => (
                    <FontAwesome6 name="chevron-up" size={14} color="#C5C5C5" />
                )}
                dropDownContainerStyle={{
                    borderColor: "#D1D5DB",
                    borderWidth: 1,
                    borderRadius: 8,
                    backgroundColor: "#FFFFFF",
                }}
                onChangeValue={(selectedValue) => {
                    setSelectedRole(selectedValue); 
                    onSelect(selectedValue); 
                }}
                placeholderStyle={{
                    color: error ? "#FF0000" : "#000", 
                    fontSize: 14,
                }}
            />
        </>
    );
};

export default CareDropdown;