import Form from "@/components/Form";
import PageContainer from "@/components/PageContainer";

export default function page() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold">Add Expense</h1>
  <Form apiEndpoint="/expense/add" />
    </PageContainer>
  )
}
