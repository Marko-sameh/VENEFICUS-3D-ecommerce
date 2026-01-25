import Image from "next/image";
import { CustomInput } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/Button";
import { useTranslation } from '@/hooks/useTranslation';
import { memo } from 'react';

const paymentMethods = [
    { name: "American Express", src: "/images/american-express.svg", alt: "American Express payment method" },
    { name: "Apple Pay", src: "/images/apple-pay.svg", alt: "Apple Pay payment method" },
    { name: "Discover", src: "/images/bancontact.svg", alt: "Discover payment method" },
    { name: "Google Pay", src: "/images/google-pay.svg", alt: "Google Pay payment method" },
    { name: "Klarna", src: "/images/klarna.svg", alt: "Klarna payment method" },
    { name: "Maestro", src: "/images/maestro.svg", alt: "Maestro payment method" },
    { name: "Mastercard", src: "/images/mastercard.svg", alt: "Mastercard payment method" },
    { name: "Shop Pay", src: "/images/shop-pay.svg", alt: "Shop Pay payment method" },
    { name: "Union Pay", src: "/images/unionpay.svg", alt: "Union Pay payment method" },
    { name: "Visa", src: "/images/visa.svg", alt: "Visa payment method" },
];

const currentYear = new Date().getFullYear();

const Footer = memo(() => {
    const { t } = useTranslation();

    return (
        <footer
            className="relative bg-gradient-to-b from-[var(--gray-light)] to-[var(--background)] px-6 w-full overflow-hidden"
            role="contentinfo"
            aria-label="Site footer"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(204,154,6,0.05),transparent_70%)] pointer-events-none" />
            <div className="relative max-w-7xl mx-auto py-12">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 tracking-wide bg-gradient-to-r from-[var(--text-primary)] via-[var(--main-color)] to-[var(--text-primary)] bg-clip-text text-transparent">
                        {t('footer.newsletter', 'Follow the Newsletter')}
                    </h2>

                    <form
                        className="max-w-md mx-auto mb-8"
                        aria-label="Newsletter subscription"
                        role="form"
                    >
                        <div className="relative group">
                            <CustomInput label="Email" />
                            <button
                                type="submit"
                                aria-label="Subscribe to newsletter"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 transition-transform hover:scale-110 hover:text-[var(--main-color)]"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    <Button variant="ghost" className="text-lg gap-2 hover:scale-105 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--main-color)]">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {t('footer.followShop', 'Follow on shop')}
                    </Button>
                </div>

                {/* Footer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center lg:items-start">
                    <div className="lg:col-start-1 lg:justify-self-start justify-self-center">
                        <h3 className="text-text-light text-sm font-semibold mb-4 uppercase tracking-wider">
                            {t('footer.countryRegion', 'Country/region')}
                        </h3>
                        <Select>
                            <SelectTrigger className="w-[180px] border-[var(--main-color)]/20 hover:border-[var(--main-color)] transition-colors">
                                <SelectValue placeholder="EUR € | Italy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">EUR € | Italy</SelectItem>
                                <SelectItem value="USD">USD $ | United States</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Methods */}
                    <div className="lg:col-start-3 lg:justify-self-end justify-self-center">
                        <h3 className="sr-only">Accepted payment methods</h3>
                        <div className="grid grid-cols-6 gap-3 max-w-xs">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.name}
                                    className="bg-white rounded-lg aspect-[3/2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[var(--main-color)]/20"
                                >
                                    <Image
                                        src={method.src}
                                        alt={method.alt}
                                        width={40}
                                        height={30}
                                        className="max-w-full max-h-full object-contain"
                                        style={{ height: "auto" }}
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gradient-to-r from-transparent via-[var(--main-color)]/30 to-transparent mt-12 pt-8">
                    <div className="text-center text-text-light text-sm">
                        <p className="mb-2 font-medium">
                            © {currentYear}
                            <strong className="ml-1 text-[var(--main-color)]">VENEFICUS</strong>
                        </p>
                        <p className="text-xs">
                            <span>
                                © VENEFICUS Team. {t('footer.allRightsReserved', 'All Rights Reserved')}.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export default Footer;
