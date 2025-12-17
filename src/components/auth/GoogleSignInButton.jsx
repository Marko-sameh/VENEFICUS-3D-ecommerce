// 'use client';

// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// import { useState } from 'react';

// export default function GoogleSignInButton({
//     callbackUrl = '/account',
//     className = '',
//     onSuccess,
//     onError
// }) {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleSuccess = async (credentialResponse) => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             
//             const decoded = jwtDecode(credentialResponse.credential);
//             

//             const response = await fetch('https://veneficus.asbackend.com/api/socialite/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Api-Code': 'B1m8fszhQ5qompWX3tC5BKGmv3fohU0iGjEmO5GjxU9o8wGHaHryNgTrWJmtkeok'
//                 },
//                 body: JSON.stringify({
//                     token: credentialResponse.credential
//                 })
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 

//                 if (data.token) {
//                     localStorage.setItem('veneficus_token', data.token);
//                 }

//                 onSuccess?.(data);
//                 window.location.href = callbackUrl;
//             } else {
//                 const errorText = await response.text();
//                 
//                 throw new Error(`Authentication failed: ${response.status}`);
//             }
//         } catch (err) {
//             
//             setError('Sign-in failed. Please try again.');
//             onError?.(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleError = () => {
//         setError('Sign-in failed. Please try again.');
//         onError?.('Sign-in failed');
//     };

//     return (
//         <div className={`w-full ${className}`}>
//             {error && (
//                 <div className="text-red-600 text-sm mb-2 text-center">{error}</div>
//             )}
//             <GoogleLogin
//                 onSuccess={handleSuccess}
//                 onError={handleError}
//                 theme="filled_blue"
//                 size="large"
//                 text="signin_with"
//                 shape="rectangular"
//                 logo_alignment="left"
//                 width="300"
//                 useOneTap
//                 disabled={isLoading}
//             />
//             {isLoading && (
//                 <div className="text-center mt-2 text-sm text-gray-600">
//                     Signing in...
//                 </div>
//             )}
//         </div>
//     );
// }



'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useParams } from 'next/navigation';

export default function GoogleSignInButton({
    callbackUrl = '/account',
    className = '',
    onSuccess,
    onError
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { loginWithGoogle } = useUserStore();
    const params = useParams();
    const localeLan = params?.locale || 'en';
    const callBackURL = `${localeLan}/account`;

    const handleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);
        

        try {
            const data = await loginWithGoogle(credentialResponse.credential);
            onSuccess?.(data);
            // window.location.href = callBackURL;
        } catch (err) {
            
            setError('Sign-in failed. Please try again.');
            onError?.(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = () => {
        setError('Sign-in failed. Please try again.');
        onError?.('Sign-in failed');
    };

    return (
        <div className={`w-full ${className}`}>
            {error && <div className="text-red-600 text-sm mb-2 text-center">{error}</div>}

            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}

                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
                width="100%"
                locale="en"
                disabled={isLoading}
            />

            {isLoading && (
                <div className="text-center mt-2 text-sm text-gray-600">
                    Signing in...
                </div>
            )}
        </div>
    );
}
