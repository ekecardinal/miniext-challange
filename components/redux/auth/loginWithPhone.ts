import { createAsyncThunk } from '@reduxjs/toolkit';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import { RootState, useAppSelector } from '../store';
import { useSelector } from 'react-redux';

export const loginWithPhone = createAsyncThunk(
    'login-phone',
    async (
        args: {
            phoneNumber: string;
            recaptchaResolved: boolean;
            recaptcha: RecaptchaVerifier | null;
            callback: (
                args:
                    | { type: 'success'; verificationId: any }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        if (!args.recaptchaResolved || !args.recaptcha) {
            dispatch(showToast({ message: 'First Resolved the Captcha', type: 'info' }));
            return;
        }
        if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
            dispatch(
                showToast({
                    message: 'Enter the Phone Number and provide the country code',
                    type: 'info',
                })
            );
            return;
        }
        try {
            const sentConfirmationCode = await signInWithPhoneNumber(
                firebaseAuth,
                args.phoneNumber,
                args.recaptcha!
            );
            dispatch(
                showToast({
                    message: 'Verification Code has been sent to your Phone',
                    type: 'success',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'success',
                    verificationId: sentConfirmationCode,
                });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const useIsLoginWithPhoneLoading = () => {
    const loading = useAppSelector((state) => state.loading.loginWithPhone);
    return loading;
};

export const verifyPhoneSignup = createAsyncThunk(
    'verifyPhoneSignup',
    async (
        args: {
            OTPCode: string;
            verificationId: any;
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
        if (args.OTPCode === null || !args.verificationId) return;

        try {
            await args.verificationId.confirm(args.OTPCode);

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
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const useVerifyPhoneSignupLoading = () => {
    const loading = useSelector((state: RootState) => state.loading.verifyPhoneSignup);
    return loading;
};
