import { useState, useEffect, useRef } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native';

interface GoogleAuthState {
    isSigninInProgress: boolean;
    signIn: () => Promise<{ idToken: string | null; accessToken: string | null } | null>;
    getTokens: () => Promise<{ idToken: string | null; accessToken: string | null }>;
}

export const useGoogleAuth = (): GoogleAuthState => {
    const [isSigninInProgress, setIsSigninInProgress] = useState(false);

    const [currentTokens, setCurrentTokens] = useState<{
        idToken: string | null;
        accessToken: string | null;
    }>({
        idToken: null,
        accessToken: null,
    });

    const signInPromiseRef = useRef<{
        resolve: (value: { idToken: string | null; accessToken: string | null } | null) => void;
        reject: (error: any) => void;
    } | null>(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: "421842147175-j5f07p6o0mofdef62f57f7n0k8t1878p.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
            scheme: process.env.EXPO_APP_SCHEME,
            path: 'redirect',
            native: `${process.env.EXPO_APP_SCHEME}:/authorize`,
        }),
    });

    useEffect(() => {
        if (response) {
            setIsSigninInProgress(false);

            if (response.type === 'success') {
                const { authentication } = response;
                const tokens = {
                    idToken: authentication?.idToken || null,
                    accessToken: authentication?.accessToken || null,
                };

                setCurrentTokens(tokens);
                if (signInPromiseRef.current) {
                    signInPromiseRef.current.resolve(tokens);
                    signInPromiseRef.current = null;
                }
            } else if (response.type === 'error') {
                Alert.alert('Google Authentication Failed', 'Please try again');
                console.error('Google sign-in error:', response.error);
                if (signInPromiseRef.current) {
                    signInPromiseRef.current.resolve(null);
                    signInPromiseRef.current = null;
                }
            } else if (response.type === 'cancel') {
                console.log('Google sign-in cancelled by user');
                if (signInPromiseRef.current) {
                    signInPromiseRef.current.resolve(null);
                    signInPromiseRef.current = null;
                }
            }
        }
    }, [response, console]);

    const signIn = async (): Promise<{
        idToken: string | null;
        accessToken: string | null;
    } | null> => {
        try {
            if (isSigninInProgress) return null;

            if (!request) {
                console.error(' Google auth request not ready');
                return null;
            }

            setIsSigninInProgress(true);

            return new Promise((resolve, reject) => {
                signInPromiseRef.current = { resolve, reject };

                promptAsync().catch((error) => {
                    console.error('Failed to prompt async:', error);
                    setIsSigninInProgress(false);
                    signInPromiseRef.current = null;
                    resolve(null);
                });
            });
        } catch (error) {
            console.error('Sign-in error:', error);
            setIsSigninInProgress(false);
            return null;
        }
    };

    const getTokens = async (): Promise<{ idToken: string | null; accessToken: string | null }> => {
        try {
            if (currentTokens.accessToken || currentTokens.idToken) {
                console.log('Returning cached tokens:', {
                    hasIdToken: !!currentTokens.idToken,
                    hasAccessToken: !!currentTokens.accessToken,
                });

                return currentTokens;
            }

            console.log('No tokens available');
            return {
                idToken: null,
                accessToken: null,
            };
        } catch (error) {
            console.error('Error getting tokens:', error);
            return {
                idToken: null,
                accessToken: null,
            };
        }
    };

    return {
        isSigninInProgress,
        signIn,
        getTokens,
    };
};
