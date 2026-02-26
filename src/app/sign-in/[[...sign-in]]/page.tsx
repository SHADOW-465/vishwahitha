import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6">


            <div className="relative z-10 w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-4xl font-heading font-bold tracking-tighter text-text-primary text-center">
                        Welcome to <span className="text-accent-gold font-drama italic tracking-normal font-light">Vishwahita</span>
                    </h1>
                    <p className="text-sm font-mono text-text-secondary mt-2 uppercase tracking-[0.2em]">Member Portal</p>
                </div>

                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            variables: {
                                colorPrimary: '#FBD300', // accent-gold
                                colorBackground: 'rgba(10, 10, 20, 0.8)', // Primary variant
                                colorText: '#FAF8F5',
                                colorTextSecondary: '#A1A1AA',
                                borderRadius: '1.5rem',
                                colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                                colorInputText: '#FAF8F5',
                                colorDanger: '#D91B5C', // accent-cranberry
                                colorTextOnPrimaryBackground: '#FAF8F5',
                            },
                            elements: {
                                rootBox: "w-full",
                                cardBox: "w-full border border-white/10 shadow-2xl backdrop-blur-3xl",
                                card: "bg-transparent w-full",
                                headerTitle: "font-heading text-xl font-bold tracking-tight",
                                headerSubtitle: "font-mono text-xs",
                                socialButtonsBlockButton: "border border-white/10 hover:bg-white/5 transition-colors",
                                socialButtonsBlockButtonText: "text-white font-mono font-medium",
                                dividerLine: "bg-white/10",
                                dividerText: "text-text-secondary font-mono text-xs uppercase tracking-widest",
                                formFieldLabel: "font-mono text-[10px] uppercase tracking-widest text-text-secondary",
                                formFieldInput: "border-white/10 focus:border-accent-gold transition-colors font-mono",
                                formButtonPrimary: "bg-accent-gold text-primary font-bold hover:brightness-110 tracking-wide transition-all",
                                footerActionText: "text-text-secondary font-mono text-xs",
                                footerActionLink: "text-accent-gold hover:text-white transition-colors font-mono text-xs",
                            }
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
