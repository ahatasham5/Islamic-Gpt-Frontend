import Head from "next/head"
import dynamic from "next/dynamic"
import { withAuth } from "@/lib/with-auth"

import { PageLoader } from "@/components/page-loader"

const ChatApp = dynamic(() => import("@/components/chat-app").then((m) => m.ChatApp), {
  ssr: false,
  loading: () => <PageLoader />,
})

function AdminPage() {
  return (
    <>
      <Head>
        <title>ইসলামী প্রশ্নোত্তর</title>
      </Head>
      <ChatApp />
    </>
  )
}

// Only super_admin can access /admin
export default withAuth(AdminPage, ["super_admin"])
