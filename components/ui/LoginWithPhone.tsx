import { useEffect, useState } from 'react';
import Input from './Input';
import LoadingButton from './LoadingButton';
import Modal from './Modal';
import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseAuth';
import {
    useSendVerificationCodeLoading,
    useVerifyPhoneNumberLoading,
    verifyPhoneNumber,
} from '../redux/auth/verifyPhoneNumber';
import { loginWithPhone, verifyPhoneSignup } from '../redux/auth/loginWithPhone';
import { useAppDispatch } from '../redux/store';
import { showToast } from '../redux/toast/toastSlice';
import { useRouter } from 'next/navigation';
import { useAuth } from '../useAuth';

export default function LoginWithPhone() {
    const dispatch = useAppDispatch();
    const [show, setShow] = useState(false);
    const auth = useAuth();

    const sendVerificationLoading = useSendVerificationCodeLoading();
    const verifyPhoneNumberLoading = useVerifyPhoneNumberLoading();

    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    const [verificationId, setVerificationId] = useState<any>();
    const [disablePhoneSubmit, setDisablePhoneSubmit] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [OTPCode, setOTPCode] = useState('');

    const router = useRouter();

    const handleSendVerification = async () => {
        // if (auth.type !== LoadingStateTypes.LOADED) return;
        dispatch(
            loginWithPhone({
                phoneNumber,
                recaptchaResolved,
                recaptcha,
                callback: (result) => {
                    if (result.type === 'error') {
                        setRecaptchaResolved(false);
                        return;
                    }
                    setVerificationId(result.verificationId);
                    setShow(true);
                },
            })
        );
    };

    const ValidateOtp = async () => {
        // if (auth.type !== LoadingStateTypes.LOADED) return;
        dispatch(
            verifyPhoneSignup({
                OTPCode,
                verificationId,
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

    useEffect(() => {
        if (phoneNumber.length > 10) {
            setDisablePhoneSubmit(false);
        }
    }, [phoneNumber]);

    // generating the recaptcha on page render
    useEffect(() => {
        const captcha = new RecaptchaVerifier(firebaseAuth, 'recaptcha-containers', {
            size: 'normal',
            callback: () => {
                setRecaptchaResolved(true);
            },

            'expired-callback': () => {
                setRecaptchaResolved(false);
                dispatch(
                    showToast({
                        message: 'Recaptcha Expired, please verify it again',
                        type: 'info',
                    })
                );
            },
        });

        captcha.render();

        setRecaptcha(captcha);
    }, []);

    return (
        <div>
            <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="phone number"
                    type="text"
                />
                <LoadingButton
                    onClick={handleSendVerification}
                    loading={sendVerificationLoading}
                    loadingText="Sending OTP"
                    disabled={disablePhoneSubmit}
                >
                    Send OTP
                </LoadingButton>
            </div>
            <div id="recaptcha-containers" />

            <Modal show={show} setShow={setShow}>
                <div className="max-w-xl w-full bg-white py-6 rounded-lg">
                    <h2 className="text-lg font-semibold text-center mb-10">
                        Enter Code to Verify
                    </h2>
                    <div className="px-4 flex items-center gap-4 pb-10">
                        <Input
                            value={OTPCode}
                            type="text"
                            placeholder="Enter your OTP"
                            onChange={(e) => setOTPCode(e.target.value)}
                        />

                        <LoadingButton
                            onClick={ValidateOtp}
                            loading={verifyPhoneNumberLoading}
                            loadingText="Verifying..."
                        >
                            Verify
                        </LoadingButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
