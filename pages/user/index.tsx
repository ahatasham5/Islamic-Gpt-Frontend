import Head from "next/head"
import { ChatApp } from "@/components/chat-app"
import { withAuth } from "@/lib/with-auth"

function UserPage() {
  return (
    <>
      <Head>
        <title>ফতোয়া চ্যাট বট</title>
      </Head>
      <ChatApp />
    </>
  )
}

export default withAuth(UserPage, ["user", "mufti", "super_admin"])
