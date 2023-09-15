import {currentProfile} from "@/lib/current-profile";
import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";
import db from "@/lib/db";

interface InviteCodePageProps {
    params: { inviteCode: string }
}

const InviteCodePage = async ({params}: InviteCodePageProps) => {
    const profile = await currentProfile()

    if (!profile) return redirectToSignIn()

    if (!params.inviteCode) {
        console.log(params.inviteCode); return
        return redirect('/')
    }

    const existingServer = await db.server.findFirst({
        where: {
            invitedCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) return redirect(`/servers/${existingServer.id}`)


    const server = await db.server.update({
        where: {
            invitedCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })

    if (server) {
        alert('Here'); return
        return redirect(`/servers/${server.id}`)
    }

    return null
}
export default InviteCodePage
