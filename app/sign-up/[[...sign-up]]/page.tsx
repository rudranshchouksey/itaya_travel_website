import { SignUp } from "@clerk/nextjs";
import { PageContainer } from "@/components/layout/PageContainer";

export default function SignUpPage() {
  return (
    <main className="flex-1 bg-surface-muted/30">
      <PageContainer className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <SignUp />
      </PageContainer>
    </main>
  );
}
