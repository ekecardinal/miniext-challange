import { createSlice } from '@reduxjs/toolkit';
import { loginWithEmail } from '../auth/loginWithEmail';
import { sendVerificationCode, verifyPhoneNumber } from '../auth/verifyPhoneNumber';
import { loginWithPhone, verifyPhoneSignup } from '../auth/loginWithPhone';

export interface LoadingStates {
    [key: string]: boolean;
}

const initialState: LoadingStates = {
    loginWithEmail: false,
    sendVerificationCode: false,
    verifyPhoneNumber: false,
    loginWithPhone: false,
    verifyPhoneSignup: false,
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginWithEmail.pending, (state) => {
            state.loginWithEmail = true;
        });
        builder.addCase(loginWithEmail.fulfilled, (state) => {
            state.loginWithEmail = false;
        });
        builder.addCase(loginWithEmail.rejected, (state) => {
            state.loginWithEmail = false;
        });
        // Send Verify Phone Number
        builder.addCase(sendVerificationCode.pending, (state) => {
            state.sendVerificationCode = true;
        });
        builder.addCase(sendVerificationCode.fulfilled, (state) => {
            state.sendVerificationCode = false;
        });
        builder.addCase(sendVerificationCode.rejected, (state) => {
            state.sendVerificationCode = false;
        });
        // Verify Phone Number
        builder.addCase(verifyPhoneNumber.pending, (state) => {
            state.verifyPhoneNumber = true;
        });
        builder.addCase(verifyPhoneNumber.fulfilled, (state) => {
            state.verifyPhoneNumber = false;
        });
        builder.addCase(verifyPhoneNumber.rejected, (state) => {
            state.verifyPhoneNumber = false;
        });
        // Login Phone Number
        builder.addCase(loginWithPhone.pending, (state) => {
            state.loginWithPhone = true;
        });
        builder.addCase(loginWithPhone.fulfilled, (state) => {
            state.loginWithPhone = false;
        });
        builder.addCase(loginWithPhone.rejected, (state) => {
            state.loginWithPhone = false;
        });
        // Verify Phone Number Signup
        builder.addCase(verifyPhoneSignup.pending, (state) => {
            state.verifyPhoneSignup = true;
        });
        builder.addCase(verifyPhoneSignup.fulfilled, (state) => {
            state.verifyPhoneSignup = false;
        });
        builder.addCase(verifyPhoneSignup.rejected, (state) => {
            state.verifyPhoneSignup = false;
        });
    },
});

export const loadingReducer = loadingSlice.reducer;
