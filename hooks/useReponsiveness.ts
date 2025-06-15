import { useState, useEffect, useMemo } from 'react';
import { Dimensions, PixelRatio, Platform } from 'react-native';

// Types
interface ScreenData {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
}

interface ResponsiveData {
    // Screen dimensions
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;

    // Device info
    isTablet: boolean;
    isPhone: boolean;
    isLandscape: boolean;
    isPortrait: boolean;

    // Breakpoints
    isSmallPhone: boolean;
    isMediumPhone: boolean;
    isLargePhone: boolean;
    isSmallTablet: boolean;
    isLargeTablet: boolean;

    // Scaling functions
    wp: (percentage: number) => number; // width percentage
    hp: (percentage: number) => number; // height percentage
    scale: (size: number) => number; // scale based on screen density
    moderateScale: (size: number, factor?: number) => number; // moderate scaling for fonts

    // Responsive values
    getResponsiveValue: <T>(values: ResponsiveValues<T>) => T;
}

interface ResponsiveValues<T> {
    smallPhone?: T;
    mediumPhone?: T;
    largePhone?: T;
    smallTablet?: T;
    largeTablet?: T;
    default: T;
}

// Constants for breakpoints (in dp)
const BREAKPOINTS = {
    SMALL_PHONE: 360,
    MEDIUM_PHONE: 400,
    LARGE_PHONE: 480,
    SMALL_TABLET: 600,
    LARGE_TABLET: 900,
} as const;

// Design dimensions (base design size)
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

/**
 * Custom hook for handling all responsiveness in React Native
 * Provides screen dimensions, breakpoints, scaling functions, and orientation detection
 */
export const useResponsive = (): ResponsiveData => {
    // State for screen and window dimensions
    const [screenData, setScreenData] = useState<ScreenData>(() => {
        const screen = Dimensions.get('screen');
        const window = Dimensions.get('window');
        return {
            width: screen.width,
            height: screen.height,
            scale: PixelRatio.get(),
            fontScale: PixelRatio.getFontScale(),
        };
    });

    const [windowData, setWindowData] = useState(() => {
        const window = Dimensions.get('window');
        return {
            width: window.width,
            height: window.height,
        };
    });

    // Listen for dimension changes
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ screen, window }) => {
            setScreenData({
                width: screen.width,
                height: screen.height,
                scale: PixelRatio.get(),
                fontScale: PixelRatio.getFontScale(),
            });

            setWindowData({
                width: window.width,
                height: window.height,
            });
        });

        return () => subscription?.remove();
    }, []);

    // Memoized calculations to prevent unnecessary re-renders
    const responsiveData = useMemo((): ResponsiveData => {
        const { width: screenWidth, height: screenHeight, scale, fontScale } = screenData;
        const { width: windowWidth, height: windowHeight } = windowData;

        // Determine device type based on smallest dimension
        const shortDimension = Math.min(screenWidth, screenHeight);
        const longDimension = Math.max(screenWidth, screenHeight);

        // Device type detection
        const isTablet = shortDimension >= BREAKPOINTS.SMALL_TABLET;
        const isPhone = !isTablet;

        // Orientation detection
        const isLandscape = screenWidth > screenHeight;
        const isPortrait = !isLandscape;

        // Breakpoint detection
        const isSmallPhone = shortDimension < BREAKPOINTS.SMALL_PHONE;
        const isMediumPhone = shortDimension >= BREAKPOINTS.SMALL_PHONE &&
            shortDimension < BREAKPOINTS.MEDIUM_PHONE;
        const isLargePhone = shortDimension >= BREAKPOINTS.MEDIUM_PHONE &&
            shortDimension < BREAKPOINTS.LARGE_PHONE;
        const isSmallTablet = shortDimension >= BREAKPOINTS.SMALL_TABLET &&
            shortDimension < BREAKPOINTS.LARGE_TABLET;
        const isLargeTablet = shortDimension >= BREAKPOINTS.LARGE_TABLET;

        // Scaling functions
        const wp = (percentage: number): number => {
            return (windowWidth * percentage) / 100;
        };

        const hp = (percentage: number): number => {
            return (windowHeight * percentage) / 100;
        };

        const scaleSize = (size: number): number => {
            const scaleWidth = windowWidth / DESIGN_WIDTH;
            const scaleHeight = windowHeight / DESIGN_HEIGHT;
            const scale = Math.min(scaleWidth, scaleHeight);
            return Math.ceil(size * scale);
        };

        const moderateScale = (size: number, factor: number = 0.5): number => {
            const baseScale = scaleSize(size);
            return size + (baseScale - size) * factor;
        };

        // Get responsive value based on current breakpoint
        const getResponsiveValue = <T>(values: ResponsiveValues<T>): T => {
            if (isLargeTablet && values.largeTablet !== undefined) {
                return values.largeTablet;
            }
            if (isSmallTablet && values.smallTablet !== undefined) {
                return values.smallTablet;
            }
            if (isLargePhone && values.largePhone !== undefined) {
                return values.largePhone;
            }
            if (isMediumPhone && values.mediumPhone !== undefined) {
                return values.mediumPhone;
            }
            if (isSmallPhone && values.smallPhone !== undefined) {
                return values.smallPhone;
            }
            return values.default;
        };

        return {
            screenWidth,
            screenHeight,
            windowWidth,
            windowHeight,
            isTablet,
            isPhone,
            isLandscape,
            isPortrait,
            isSmallPhone,
            isMediumPhone,
            isLargePhone,
            isSmallTablet,
            isLargeTablet,
            wp,
            hp,
            scale: scaleSize,
            moderateScale,
            getResponsiveValue,
        };
    }, [screenData, windowData]);

    return responsiveData;
};

export const useResponsiveFontSize = (baseFontSize: number): number => {
    const { moderateScale } = useResponsive();
    return moderateScale(baseFontSize);
};

/**
 * Hook for responsive spacing
 */
export const useResponsiveSpacing = () => {
    const { scale } = useResponsive();

    return useMemo(() => ({
        xs: scale(4),
        sm: scale(8),
        md: scale(16),
        lg: scale(24),
        xl: scale(32),
        xxl: scale(48),
    }), [scale]);
};

/**
 * Hook for responsive dimensions with common ratios
 */
export const useResponsiveDimensions = () => {
    const { wp, hp, scale } = useResponsive();

    return useMemo(() => ({
        // Common button sizes
        buttonHeight: {
            small: scale(32),
            medium: scale(44),
            large: scale(56),
        },

        // Common card dimensions
        cardWidth: {
            full: wp(100),
            large: wp(90),
            medium: wp(80),
            small: wp(70),
        },

        // Common icon sizes
        iconSize: {
            xs: scale(12),
            sm: scale(16),
            md: scale(24),
            lg: scale(32),
            xl: scale(48),
        },

        // Avatar sizes
        avatarSize: {
            small: scale(32),
            medium: scale(48),
            large: scale(64),
            xlarge: scale(96),
        },
    }), [wp, hp, scale]);
};

