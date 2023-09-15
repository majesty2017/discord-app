'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-store";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, Copy, RefreshCcw} from "lucide-react";
import {useOrigin} from "@/hooks/use-origin";
import {useState} from "react";
import axios from "axios";

export const LeaveModal = () => {
    const {onOpen, isOpen, onClose, type, data} = useModal()
    const isModalOpen = isOpen && type === 'leaveServer'
    const {server} = data
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const origin = useOrigin()

    const inviteUrl = `${origin}/invite/${server?.invitedCode}`
    const onCopy = () => {
      navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNew = async () => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/invite-code`).then(response => {
                onOpen('invite', {server: response.data})
            })
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>Invite Friends</DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70'>Server invite link</Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input
                            disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                            value={inviteUrl}
                        />
                        <Button size='icon' onClick={onCopy} disabled={isLoading}>
                            {copied
                                ? <Check className='w-4 h-4 text-green-500' />
                                : <Copy className='w-4 h-4' />}
                        </Button>
                    </div>
                    <Button variant='link' size='sm' className='text-xs text-zinc-500 mt-4' onClick={onNew} disabled={isLoading}>
                        Generate a new link
                        <RefreshCcw className='h-4 w-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
