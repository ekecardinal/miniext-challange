import { useCallback, useEffect, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch } from '../redux/store';
import LoadingButton from './LoadingButton';
import LoginWithGoogleButton from './LoginWithGoogleButton';
import Input from './Input';
import { isEmail } from 'validator';
import { loginWithEmail, useIsLoginWithEmailLoading } from '../redux/auth/loginWithEmail';
import LoginWithPhone from './LoginWithPhone';
import { RecaptchaVerifier } from 'firebase/auth';
import { useSendVerificationCodeLoading } from '../redux/auth/verifyPhoneNumber';
import { loginWithPhone } from '../redux/auth/loginWithPhone';
import { firebaseAuth } from '../firebase/firebaseAuth';
import { showToast } from '../redux/toast/toastSlice';

interface SignUpModalProps {
    open: boolean;
    setOpen: (show: boolean) => void;
}
const SignUpModal = (props: SignUpModalProps) => {
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);
    const isLoading = useIsLoginWithEmailLoading();
    const [show, setShow] = useState(false);

    const sendVerificationLoading = useSendVerificationCodeLoading();

    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    const [verificationId, setVerificationId] = useState({});
    const [disablePhoneSubmit, setDisablePhoneSubmit] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    // const handleSendVerification = async () => {
    //     // if (auth.type !== LoadingStateTypes.LOADED) return;
    //     dispatch(
    //         loginWithPhone({
    //             phoneNumber,
    //             recaptchaResolved,
    //             recaptcha,
    //             callback: (result) => {
    //                 if (result.type === 'error') {
    //                     setRecaptchaResolved(false);
    //                     return;
    //                 }
    //                 setVerificationId(result.verificationId);
    //                 setShow(true);
    //             },
    //         })
    //     );
    // };

    // useEffect(() => {
    //     if (phoneNumber.length > 10) {
    //         setDisablePhoneSubmit(false);
    //     }
    // }, [phoneNumber]);

    // generating the recaptcha on page render
    // useEffect(() => {
    //     const captcha = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
    //         size: 'normal',
    //         callback: () => {
    //             setRecaptchaResolved(true);
    //         },

    //         'expired-callback': () => {
    //             setRecaptchaResolved(false);
    //             dispatch(
    //                 showToast({
    //                     message: 'Recaptcha Expired, please verify it again',
    //                     type: 'info',
    //                 })
    //             );
    //         },
    //     });

    //     captcha.render();

    //     setRecaptcha(captcha);
    // }, []);

    useEffect(() => {
        if (isEmail(email) && password.length >= 6) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [email, password]);

    // Signup with email and password and redirecting to home page
    const signUpWithEmail = useCallback(async () => {
        // verify the user email before signup
        dispatch(
            loginWithEmail({
                type: 'sign-up',
                email,
                password,
            })
        );

        /* if (credentials.user.emailVerified === false) {
                await sendEmailVerification(credentials.user);

                dispatch(
                    showToast({
                        message: 'Verification Email has been sent to your Email',
                        type: 'success',
                    })
                );
            } */

        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [email, password, dispatch]);

    return (
        <Modal show={props.open} setShow={props.setOpen}>
            <div className="max-w-md w-full bg-white py-6 rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-10">Sign Up</h2>
                <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        name="email"
                        type="text"
                    />
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        name="password"
                        type="password"
                    />
                    <LoadingButton
                        onClick={signUpWithEmail}
                        disabled={disableSubmit}
                        loading={isLoading}
                    >
                        Sign Up
                    </LoadingButton>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>
                    <div>
                        <LoginWithPhone />
                        {/* <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
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
                        <div id="recaptcha-container" /> */}

                        {/* <Modal show={show} setShow={setShow}>
                            <div className="max-w-xl w-full bg-white py-6 rounded-lg">
                                <h2 className="text-lg font-semibold text-center mb-10">
                                    Enter Code to Verify
                                </h2>
                                <div className="px-4 flex items-center gap-4 pb-10">
                                    <Input
                                        // value={OTPCode}
                                        type="text"
                                        placeholder="Enter your OTP"
                                        // onChange={(e) => setOTPCode(e.target.value)}
                                    />

                                    <LoadingButton
                                        // onClick={ValidateOtp}
                                        // loading={verifyPhoneNumberLoading}
                                        loadingText="Verifying..."
                                    >
                                        Verify
                                    </LoadingButton>
                                </div>
                            </div>
                        </Modal> */}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-3">
                        <LoginWithGoogleButton />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SignUpModal;
