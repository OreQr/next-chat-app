"use server"

import z from "zod"

import { emitter } from "@/lib/events"

const messageSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
})

export const sendMessage = (data: z.infer<typeof messageSchema>) => {
  const message = messageSchema.safeParse(data)
  if (!message.success) return

  emitter.emit("chat", message.data)
}
