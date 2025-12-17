
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export async function generateMetadata() {
    return {
        title: 'Create Account | VENEFICUS',
        description: 'Create a VENEFICUS account using Google OAuth to save your preferences, track orders, and receive personalized recommendations.',
        openGraph: {
            title: 'Create Account | VENEFICUS',
            description: 'Create a VENEFICUS account using Google OAuth.',
            url: '/auth/register',
            siteName: 'VENEFICUS',
            type: 'website'
        }
    };
}

export default function RegisterPage() {

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
                    Create Account
                </h1>
                <p
                    className="text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-body-family)' }}
                >
                    Join VENEFICUS using your Google account
                </p>
            </div>

            <div className="space-y-6">
                <GoogleSignInButton 
                    callbackUrl="/account"
                    children="Create Account with Google"
                />
                
                <div
                    className="text-center text-sm p-4 rounded-lg"
                    style={{ 
                        backgroundColor: 'var(--background-secondary)',
                        color: 'var(--text-light)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <p style={{ fontFamily: 'var(--font-body-family)' }}>
                        🔒 We use Google OAuth for secure account creation.
                        <br />
                        Your Google account will be linked to your VENEFICUS profile.
                    </p>
                </div>
            </div>

            <div
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--text-light)' }}
            >
                <p style={{ fontFamily: 'var(--font-body-family)' }}>
                    Already have an account?{' '}
                    <a
                        href="/auth/login"
                        className="text-[var(--main-color)] hover:underline font-medium"
                    >
                        Sign in with Google
                    </a>
                </p>
            </div>
        </div>
    );
}