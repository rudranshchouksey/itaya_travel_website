export const Section = ({children, className=''}: { children: React.ReactNode; className?: string }) => <section className={`py-8 md:py-12 ${className}`}>{children}</section>;
