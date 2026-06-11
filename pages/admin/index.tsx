import Head from "next/head"
import { ChatApp } from "@/components/chat-app"
import { withAuth } from "@/lib/with-auth"

function AdminPage() {
  return (
    <>
      <Head>
        <title>ফতোয়া চ্যাট বট — Admin</title>
      </Head>
      <ChatApp />
    </>
  )
}

// Only super_admin can access /admin
export default withAuth(AdminPage, ["super_admin"])
