import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { showToast } from '../toast/toastSlice';
import { LoadingStateTypes } from '../types';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthContextType } from '@/components/useAuth';

export const updateUserEmail = createAsyncThunk(
    'updateUserEmail',
    async (
        args: {
            email: string;
            password: string;
            auth: AuthContextType;
            callback: (
                args:
                    | { type: 'success' }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        if (args.email === null || args.auth.type !== LoadingStateTypes.LOADED) return;

        try {
            const credential = EmailAuthProvider.credential(args.email, args.password);
            console.log('credential', credential);
            await linkWithCredential(args.auth.user, credential);
            // await updateEmail(args.auth.user, credential);

            firebaseAuth.currentUser?.reload();

            dispatch(
                showToast({
                    message: 'Logged in Successfully',
                    type: 'success',
                })
            );

            args.callback({ type: 'success' });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            console.log('error', error.code);
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const useUpdateUserEmailLoading = () => {
    const loading = useSelector((state: RootState) => state.loading.updateUserEmail);
    return loading;
};
