// export function ProgressSteps({ steps }) {
//     return (
//         <nav aria-label="Progress">
//             <ol className="overflow-hidden">
//                 {steps.map((step, stepIdx) => (
//                     <li
//                         key={step.id}
//                         className={stepIdx !== steps.length - 1 ? 'pb-10' : ''}
//                     >
//                         <div className="-ml-px absolute mt-0.5 start-4 w-0.5 h-full bg-[var(--border-color)]" />

//                         <div className="relative flex items-start group">
//                             <span className="flex h-9 items-center" aria-hidden="true">
//                                 <span className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${step.status === 'complete'
//                                         ? 'bg-[var(--main-color)]'
//                                         : step.status === 'current'
//                                             ? 'bg-[var(--main-color)] ring-2 ring-[var(--main-color)] ring-offset-2'
//                                             : 'bg-[var(--gray-light)]'
//                                     }`}>
//                                     {step.status === 'complete' ? (
//                                         <svg
//                                             className="w-5 h-5 text-[var(--text-white)]"
//                                             viewBox="0 0 20 20"
//                                             fill="currentColor"
//                                             aria-hidden="true"
//                                         >
//                                             <path
//                                                 fillRule="evenodd"
//                                                 d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
//                                                 clipRule="evenodd"
//                                             />
//                                         </svg>
//                                     ) : (
//                                         <span
//                                             style={{
//                                                 color: step.status === 'current' ? 'var(--main-color)' : 'var(--text-light)'
//                                             }}
//                                         >
//                                             {stepIdx + 1}
//                                         </span>
//                                     )}
//                                 </span>
//                             </span>

//                             <span className="ml-4 min-w-0 flex flex-col">
//                                 <span
//                                     className="text-sm font-medium"
//                                     style={{
//                                         color: step.status === 'complete' || step.status === 'current'
//                                             ? 'var(--text-primary)'
//                                             : 'var(--text-light)'
//                                     }}
//                                 >
//                                     {step.name}
//                                 </span>
//                                 {step.href ? (
//                                     <a
//                                         href={step.href}
//                                         className="text-sm hover:text-[var(--main-color)]"
//                                         style={{
//                                             color: step.status === 'current' ? 'var(--main-color)' : 'var(--text-light)'
//                                         }}
//                                     >
//                                         {step.status === 'complete' ? 'Edit' : step.status === 'current' ? 'Current' : ''}
//                                     </a>
//                                 ) : null}
//                             </span>
//                         </div>
//                     </li>
//                 ))}
//             </ol>
//         </nav>
//     );
// }


"use client";

import { useUserSettings } from "@/hooks/useUserSettings";
import { Check } from "lucide-react";

export function ProgressSteps() {
    const { checkout, handleCheckoutNext, handleCheckoutBack } = useUserSettings();
    
    const steps = [
        { id: "cart", name: "Cart", status: "complete" },
        { id: "information", name: "Information", status: checkout.currentStep === 1 ? "current" : checkout.currentStep > 1 ? "complete" : "upcoming" },
        { id: "shipping", name: "Shipping", status: checkout.currentStep === 2 ? "current" : checkout.currentStep > 2 ? "complete" : "upcoming" },
        { id: "payment", name: "Payment", status: checkout.currentStep === 3 ? "current" : checkout.currentStep > 3 ? "complete" : "upcoming" },
    ];

    return (
        <div className="w-full">
            {/* Steps */}
            <nav aria-label="Progress">
                <ol className="flex items-center justify-between w-full relative">
                    {steps.map((step, idx) => (
                        <li key={step.id} className="flex items-center w-full">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <span
                                    className={`flex items-center justify-center w-12 h-12 rounded-full text-base font-bold transition-all duration-300
                  ${step.status === "complete"
                                            ? "bg-[var(--main-color)] text-[var(--text-white)]"
                                            : step.status === "current"
                                                ? "border-2 border-[var(--main-color)] text-[var(--main-color)] bg-[var(--text-white)]"
                                                : "bg-[var(--gray-light)] text-[var(--text-light)]"
                                        }`}
                                >
                                    {step.status === "complete" ? <Check size={22} /> : idx + 1}
                                </span>
                                <span
                                    className={`mt-3 text-sm font-medium transition-colors
                  ${step.status === "current" || step.status === "complete"
                                            ? "text-[var(--text-primary)]"
                                            : "text-[var(--text-light)]"
                                        }`}
                                >
                                    {step.name}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {idx < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-[2px] mx-4 transition-all duration-300
                  ${idx < checkout.currentStep
                                            ? "bg-[var(--main-color)]"
                                            : "bg-[var(--border-color)]"
                                        }`}
                                />
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Navigation controls */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={handleCheckoutBack}
                    disabled={checkout.currentStep === 1}
                    className="px-6 py-2 rounded-lg bg-[var(--gray-light)] text-[var(--text-secondary)] hover:bg-[var(--gray)] disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleCheckoutNext}
                    disabled={checkout.currentStep === 4}
                    className="px-6 py-2 rounded-lg bg-[var(--main-color)] text-[var(--text-white)] hover:bg-[var(--main-color-hover)] disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
