import DashBoard from "@/components/DashBoard";
import PageContainer from "@/components/PageContainer";
import QuickAccess from "@/components/QuickAccess";

export default async function Home() {
  return (
    <PageContainer>
      <DashBoard />
      <div className="rounded-lg border p-4">
        <QuickAccess />
      </div>
    </PageContainer>
  );
}
