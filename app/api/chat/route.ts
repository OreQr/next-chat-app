import { emitter } from "@/lib/events"

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  let responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  const write = async (data: object) => {
    const encoded = encoder.encode(`data: ${JSON.stringify(data)}\n\n`)

    await writer.write(encoded)
  }

  const sendMessage = async (data: any) => {
    await write(data)
  }

  emitter.on("chat", sendMessage)

  request.signal.addEventListener("abort", async () => {
    emitter.removeListener("chat", sendMessage)
  })

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  })
}
