import { MouseEvent, useState } from 'react';
import { useAuth } from '../../hooks/authContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doSignInWithGoogleRedirect, doSignInWithFacebook } from '../../firebase/auth';
import { Eye, EyeClosed, X, Check, CircleAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import EmailVerificationModal from './EmailVerificationModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import SignInWithSocials from '../Buttons/SignInWithSocials';

// Component for the Login Modal
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
}
const LoginModal = ({ isOpen, onClose, onSwitch }: LoginModalProps) => {

  // Form state variables and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [isSigningInWithFacebook, setisSigningInWithFacebook] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  // Get user authentication state and role from context
  const { userLoggedIn, currentUser, role } = useAuth();

  // Handle email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
        // Attempt to sign in
        await doSignInWithEmailAndPassword(email, password, rememberMe);
        // After signing in, if the user exists but is not verified, show the verification modal
        if (currentUser && !currentUser.emailVerified) {
          setShowVerificationModal(true);
        }
    } catch (error) {
        const errorMsg = (error as any).code === 'auth/user-not-found' || (error as any).code === 'auth/wrong-password'
            ? 'Invalid email or password. Please try again.'
            : `We couldn't find your account. Please check your email and password.`;
        setErrorMessage(errorMsg);
    } finally {
        setIsSigningIn(false);
    }
};
  
  // Function to handle Google sign-in
  const onGoogleSignIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isSigningInWithGoogle) {
      setIsSigningInWithGoogle(true);
      doSignInWithGoogle().catch(err => {
        setIsSigningInWithGoogle(false);
        setErrorMessage('An error occurred while signing in with Google. Please try again.');
      });
    }
  };

  // Function to handle Facebook sign-in
  const onFacebookSignIn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isSigningInWithFacebook) {
      setisSigningInWithFacebook(true);
      doSignInWithFacebook().catch(err => {
        setisSigningInWithFacebook(false);
        setErrorMessage('An error occurred while signing in with Facebook. Please try again.');
      });
    }
  };

  const handleForgotPassword = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
  }

  // Show the forgot password modal if needed
  if (showForgotPasswordModal) {
    return <ForgotPasswordModal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />;
  }

  // Show the verification modal if the user is not verified
  if (showVerificationModal) {
    return <EmailVerificationModal onVerified={() => navigate(`/${role}`)} />;
  }

  // Redirect to the appropriate role page if the user is logged in
  if (userLoggedIn) {
    return <Navigate to={`/${role}`} replace={true} />;
  }

  // If modal is not visible, return null to prevent rendering
  if (!isOpen) { return null; }

  return (
    <>
      <motion.div
        className={`relative max-w-md flex-1 bg-white py-10 px-15 rounded-lg shadow-lg`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{
            duration: 0.3,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.4 },
        }}
      >
        {/* Modal content */}
        {/* Close button */}
        <a
          className="absolute top-3 right-5 text-black text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </a>

        {/* Error message display */}
        <AnimatePresence>
          {errorMessage &&
            <motion.div
              className="relative flex mt-5 mb-4 py-5 px-15 bg-[#FBE6E6] text-xs justify-center items-center rounded-sm shadow-sm drop-shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CircleAlert size={20} className="absolute top-auto left-6 text-red-600" />
              <p className="text-[#D30001]">{errorMessage}</p>
            </motion.div>
          }
        </AnimatePresence>

        {/* Modal title */}
        <h2 className="text-xl font-bold mb-4">SalimBigkas Account</h2>

        {/* Login form */}
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className="mt-10 mb-4 text-left relative">
            <input
              disabled={isSigningIn}
              name="email"
              type="email"
              id="email"
              autoComplete="email"
              required
              autoFocus
              minLength={1}
              maxLength={30}
              className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${email ? 'border-[#2C3E50]' : 'border-gray-300'}`}
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={() => {
                setErrorMessage('');
              }}
            />
            <label
              htmlFor="email"
              className={`absolute text-sm font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${email ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
            >
              Email
            </label>
          </div>

          {/* Password input */}
          <div className="mt-5 mb-4 text-left relative">
            <input
              disabled={isSigningIn}
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              required
              minLength={8}
              maxLength={20}
              className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${password ? 'border-[#2C3E50]' : 'border-gray-300'}`}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={() => {
                setErrorMessage('');
              }}
            />
            {/* Toggle password visibility */}
            <button
              type="button"
              className="absolute right-4 top-4.5 border-none bg-transparent cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye size={24} color={`${password ? '#2C3E50' : 'oklch(87.2% 0.01 258.338)'}`} />
              ) : (
                <EyeClosed size={24} color={`${password ? '#2C3E50' : 'oklch(87.2% 0.01 258.338)'}`} />
              )}
            </button>
            <label
              htmlFor="password"
              className={`absolute text-sm font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${password ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
            >
              Password
            </label>
          </div>

          {/* // Remember me and forgot password links */}
          <div className="mt-4 flex items-center justify-between text-xs">
            {/* Remember me toggle */}
            <div className="flex items-center gap-2">
              {/* Toggle Switch Container */}
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  rememberMe ? 'bg-[#2C3E50]' : 'bg-gray-300'
                }`}
              >
                {/* Toggle Knob */}
                <div
                  className={`relative bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    rememberMe ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {/* Icon Overlay */}
                  {rememberMe ? (
                    // Check icon
                    <Check size={8} strokeWidth={5} className='absolute inset-0 m-auto'/>
                  ) : (
                    // X icon
                    <X size={8} strokeWidth={5} className='absolute inset-0 m-auto'/>
                  )}
                </div>
              </div>
              <span className={`${rememberMe? 'font-medium text-gray-700' : 'text-gray-600'}`}>{rememberMe ? 'You’ll stay logged in' : 'Remember me?'}</span>
            </div>
            {/* Forgot password link */}
            <a className="text-[#2C3E50] hover:underline" href="#" onClick={handleForgotPassword}>
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className={`w-full mt-6 bg-[#2C3E50] text-white p-4 rounded-lg shadow-md drop-shadow-lg ${isSigningIn ? 'opacity-80 cursor-not-allowed' : 'hover:font-medium hover:border-[#386BF6] hover:bg-[#34495e]'}`}
          >
            {isSigningIn ? 
              <div className="flex items-center justify-center">
                <svg className="animate-spin size-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.47715 2 2 6.47715 2 12H5C5 7.58172 8.58172 4 12 4V2Z" fill="currentColor" />
                  <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 16.4183 15.4183 20 12 20V22Z" fill="currentColor" />
                </svg>
                Processing...
              </div>
              : 
              'Login'
            }
          </button>
        </form>

        {/* Divider */}
        <div className='flex flex-row mt-5 w-full'>
          <div className='border-b-1 mb-2.5 mr-2 w-full border-gray-200'></div>
          <div className='text-sm mb-0.5 w-fit text-gray-500'>or</div>
          <div className='border-b-2 mb-2.5 ml-2 w-full border-gray-200'></div>
        </div>

        {/* Social login buttons */}
        <SignInWithSocials
          onGoogleSignIn={onGoogleSignIn}
          onFacebookSignIn={onFacebookSignIn}
          isSigningInWithGoogle={isSigningInWithGoogle}
          isSigningInWithFacebook={isSigningInWithFacebook}
        />

        {/* Switch to sign-up link */}
        <p className="mt-4 text-sm">
          New to SalimBigkas? 
          <a 
            href="/signup" 
            className="ml-1 cursor-pointer hover:underline" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Create a new account"
            onClick={(e) => {
                e.preventDefault()
                onSwitch()
              }
            }
          >
            Create yours now.
          </a>
        </p>
      </motion.div>
    </>
  );
};

export default LoginModal;