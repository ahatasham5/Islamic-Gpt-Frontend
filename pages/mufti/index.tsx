import Head from "next/head"
import { ChatApp } from "@/components/chat-app"
import { withAuth } from "@/lib/with-auth"

function MuftiPage() {
  return (
    <>
      <Head>
        <title>ফতোয়া চ্যাট বট — Mufti</title>
      </Head>
      <ChatApp />
    </>
  )
}

export default withAuth(MuftiPage, ["mufti", "super_admin"])
