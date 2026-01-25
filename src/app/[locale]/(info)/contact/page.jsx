'use client';
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/ui/input";
import { motion } from 'framer-motion';

export default function ContactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        mainEntity: {
            "@type": "Organization",
            name: "VENEFICUS",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://veneficus.com",
            contactPoint: {
                "@type": "ContactPoint",
                telephone: "+20-123-456-7890",
                contactType: "Customer Support",
                email: "support@veneficus.com"
            }
        }
    };

    return (
        <main className="bg-[var(--background)] text-[var(--text-primary)] px-6 py-16 md:px-20 lg:px-32">
            <JsonLd data={jsonLd} />

            <section className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-[var(--text-primary)] mb-4">
                        Contact Us
                    </h1>
                    <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: 64 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                    />
                    <p className="text-[var(--text-secondary)] mt-6 text-lg">
                        Have questions about our products or services? <br /> Our team is here to
                        help. Fill out the form below or reach out using the contact details.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <ContactForm />
                </motion.div>
                {/* <form className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-md space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-bold text-[var(--text-primary)] mb-2"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-white text-[var(--text-primary)]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-[var(--text-primary)] mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-white text-[var(--text-primary)]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-bold text-[var(--text-primary)] mb-2"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            placeholder="Write your message..."
                            rows="5"
                            className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-white text-[var(--text-primary)]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-6 bg-[var(--main-color)] hover:bg-[var(--main-color-hover)] text-[var(--text-white)] rounded-lg font-semibold transition-colors duration-300"
                    >
                        Send Message
                    </button>
                </form> */}
                {/* Contact Info */}
                {/* <div className="mt-12 space-y-4">
                    <h2 className="text-2xl font-[var(--font-heading-family)] mb-4">
                        Get in Touch
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        📍 123 Fashion Street, Cairo, Egypt
                    </p>
                    <p className="text-[var(--text-secondary)]">
                        📞 +20-123-456-7890
                    </p>
                    <p className="text-[var(--text-secondary)]">
                        ✉️ support@veneficus.com
                    </p>
                </div> */}
            </section>
        </main>
    );
}
