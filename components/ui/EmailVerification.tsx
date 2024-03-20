import React, { useEffect, useState } from 'react';
import LoadingButton from './LoadingButton';
import ToastBox from './ToastBox';
import Logout from './Logout';
import Input from './Input';
import { LoadingStateTypes } from '../redux/types';
import { updateUserEmail, useUpdateUserEmailLoading } from '../redux/auth/updateEmail';
import { useAuth } from '../useAuth';
import { useAppDispatch } from '../redux/store';
import { useRouter } from 'next/navigation';

export default function EmailVerification() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);

    const dispatch = useAppDispatch();
    const auth = useAuth();
    const router = useRouter();
    const sendUpdateEmailLoading = useUpdateUserEmailLoading();

    // Update User Email
    const updateEmail = async () => {
        if (auth.type !== LoadingStateTypes.LOADED) return;
        dispatch(
            updateUserEmail({
                auth,
                email,
                password,
                callback: (result) => {
                    if (result.type === 'error') {
                        return;
                    }
                    // needed to reload auth user
                    router.refresh();
                },
            })
        );
    };

    // Realtime validation to enable submit button
    useEffect(() => {
        if (email) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [email]);

    return (
        <div>
            <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="w-auto h-12 mx-auto"
                            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                            Update Email
                        </h2>
                    </div>

                    <div className="max-w-xl w-full rounded overflow-hidden shadow-lg py-2 px-4">
                        <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email"
                                type="text"
                            />
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                type="text"
                            />
                            <LoadingButton
                                onClick={updateEmail}
                                loading={sendUpdateEmailLoading}
                                disabled={disableSubmit}
                                loadingText="Update Email"
                            >
                                Update Email
                            </LoadingButton>
                        </div>
                        <div id="recaptcha-container" />
                        <div className="flex w-full flex-col">
                            <Logout />
                        </div>
                    </div>
                </div>
                <ToastBox />
            </div>
        </div>
    );
}
