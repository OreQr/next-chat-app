"use client"

import crypto from "crypto"
import { useEffect, useMemo, useState } from "react"
import type { Message as MessageType } from "@/types"
import { SendIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { sendMessage } from "./_actions/chat"
import Avatar from "./avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([])

  const name = useMemo(() => crypto.randomBytes(8).toString("hex"), [])

  const [input, setInput] = useState<string>("")
  const inputLength = input.trim().length

  useEffect(() => {
    const eventSource = new EventSource(`/api/chat`)

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data)

      setMessages((prev) => [message, ...prev])
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <>
      <div className="relative mx-auto w-full max-w-lg flex-1 overflow-hidden">
        <div className="absolute inset-0 mx-8 flex flex-col-reverse gap-y-2 overflow-auto pr-4">
          {messages.map((message, index) => (
            <Message key={index} {...message} me={message.name === name} />
          ))}
        </div>
      </div>
      <div className="container max-w-lg pb-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (inputLength === 0) return
            sendMessage({
              name: name,
              content: input,
            })
            setInput("")
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  )
}

const Message = ({ name, content, me }: MessageType & { me: boolean }) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar size={32} name={name} />
      <div
        className={cn(
          "w-fit break-all rounded-lg border px-3 py-1 shadow-sm",
          me && "border-primary bg-primary"
        )}
      >
        {content}
      </div>
    </div>
  )
}
