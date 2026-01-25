import { redirect } from 'next/navigation';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export async function generateMetadata() {
    return {
        title: 'Password Reset | VENEFICUS',
        description: 'Password reset is no longer needed. Sign in with Google OAuth for secure authentication.',
    };
}

export default function ForgotPasswordPage() {
    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1
                    className="text-3xl font-bold mb-2"
                    style={{
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-heading-family)'
                    }}
                >
                    Password Reset Not Needed
                </h1>
                <p
                    className="text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-body-family)' }}
                >
                    We now use Google OAuth for secure authentication
                </p>
            </div>

            <div className="space-y-6">
                <div
                    className="text-center p-6 rounded-lg"
                    style={{ 
                        backgroundColor: 'var(--background-secondary)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <p
                        className="text-[var(--text-secondary)] mb-4"
                        style={{ fontFamily: 'var(--font-body-family)' }}
                    >
                        🔒 Password resets are no longer needed!
                        <br />
                        We use Google OAuth for secure, passwordless authentication.
                    </p>
                    
                    <GoogleSignInButton 
                        callbackUrl="/account"
                        children="Sign in with Google"
                    />
                </div>
            </div>

            <div
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--text-light)' }}
            >
                <p style={{ fontFamily: 'var(--font-body-family)' }}>
                    <a
                        href="/auth/login"
                        className="text-[var(--main-color)] hover:underline"
                    >
                        ← Back to Sign In
                    </a>
                </p>
            </div>
        </div>
    );
}