import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-navy px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/AAAviation_LOGO_Main.svg"
            alt="AAA Aviation Logo"
            width={148}
            height={56}
            className="h-12 w-auto"
            loading="eager"
          />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-card-xl sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
