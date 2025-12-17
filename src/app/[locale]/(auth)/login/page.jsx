import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export async function generateMetadata() {
    return {
        title: 'Sign In | VENEFICUS',
        description: 'Sign in to your VENEFICUS account using Google OAuth to access exclusive features, order history, and personalized recommendations.',
        openGraph: {
            title: 'Sign In | VENEFICUS',
            description: 'Sign in to your VENEFICUS account using Google OAuth.',
            url: '/auth/login',
            siteName: 'VENEFICUS',
            type: 'website'
        }
    };
}

export default function LoginPage() {

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
                    Welcome Back
                </h1>
                <p
                    className="text-[var(--text-secondary)]"
                    style={{ fontFamily: 'var(--font-body-family)' }}
                >
                    Sign in with Google to access your account
                </p>
            </div>

            <div className="space-y-6">
                <GoogleSignInButton callbackUrl="/account" />

                <div
                    className="text-center text-sm p-4 rounded-lg"
                    style={{
                        backgroundColor: 'var(--background-secondary)',
                        color: 'var(--text-light)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <p style={{ fontFamily: 'var(--font-body-family)' }}>
                        🔒 We now use Google OAuth for secure authentication.
                        <br />
                        Email/password login has been disabled for enhanced security.
                    </p>
                </div>
            </div>

            <div
                className="mt-6 text-center text-sm"
                style={{ color: 'var(--text-light)' }}
            >
                <p style={{ fontFamily: 'var(--font-body-family)' }}>
                    Don't have an account?{' '}
                    <a
                        href="/auth/register"
                        className="text-[var(--main-color)] hover:underline font-medium"
                    >
                        Create one with Google
                    </a>
                </p>
            </div>
        </div>
    );
}