export const theme = {
    light: {
        background: {
            primary: "#FFFFFF",
            secondary: "#F7F9FC",
            tertiary: "#EDF1F7"
        },

        color: {
            primary: "#1A1A1A",
            secondary: "#4A4A4A",
            tertiary: "#6E6E6E"
        },

        iconColor: {
            primary: "#2667FF",     // Accent – clean university blue
            secondary: "#003A9E",
        },

        borderColor: {
            primary: "#DCE3F0",
            secondary: "#C3CDDF",
            tertiary: "#AEBBD1"
        },
    },

    dark: {
        background: {
            primary: "#0D0F1A",
            secondary: "#1A1D2D",
            tertiary: "#262A3F"
        },

        color: {
            primary: "#FFFFFF",
            secondary: "#DADBE0",
            tertiary: "#A5A7B1"
        },

        iconColor: {
            primary: "#eaff4cff",  
            secondary: "",
            tertiary: "",
        },

        borderColor: {
            primary: "#2A2F47",
            secondary: "#373E5A",
            tertiary: "#4B5477"
        },
    },
};

// Shared font sizes
theme.light.fontSize = theme.dark.fontSize = {
    sub: "8px",
    small: "14px",
    medium: "16px",
    large: "20px",
    title: "24px",
    header: "32px"
};
