import { NextRequest, NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const streamVideo = (apiKey && apiSecret) 
  ? new StreamClient(apiKey, apiSecret)
  : null;

function verifySignatureWithSDK(body: string, signature: string): boolean {
  if (!streamVideo) return false;
  return streamVideo.verifyWebhook(body, signature);
};

export async function POST(req: NextRequest) {
  if (!streamVideo) {
    console.error("[Webhook] Stream API Key or Secret is missing");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }
  try {
    const rawBody = await req.text();
    
    if (!rawBody) {
      console.log("Received empty webhook body, skipping...");
      return NextResponse.json({ success: true });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("Failed to parse webhook JSON:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    
    const signature = req.headers.get("x-signature") || req.headers.get("x-stat-signature") || "";
    const apiKey = req.headers.get("x-api-key") || "";

    // Verify webhook signature
    const valid = verifySignatureWithSDK(rawBody, signature);
    
    if (!valid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = body;
    console.log(`Received Stream Webhook: ${event.type}`);

    switch (event.type) {
      case "call.session_started":
        console.log(`[Webhook] Received call.session_started for CID: ${event.call?.cid || event.call_cid}`);
        await handleCallSessionStarted(event);
        break;

      case "call.session_participant_joined":
        const participantId = event.participant?.user?.id;
        console.log(`[Webhook] Received call.session_participant_joined. Participant: ${participantId}`);
        
        // Only trigger if it's NOT an agent joining, as a backup to session_started
        if (participantId && !participantId.startsWith('agent-')) {
          console.log(`[Webhook] Human participant ${participantId} joined. Ensuring agent is connected...`);
          await handleCallSessionStarted(event);
        }
        break;

      case "call.session_ended":
        console.log("Call session ended. Updating status...");
        await handleCallEnded(event);
        break;
      
      case "call.ended":
        console.log("Call ended. Updating status...");
        await handleCallEnded(event);
        break;

      case "call.recording_ready":
        console.log("Call recording ready. Updating DB...");
        await handleRecordingReady(event);
        break;

      case "call.session_participant_left":
        console.log(`[Webhook] Participant left: ${event.participant?.user?.id}`);
        await handleParticipantLeft(event);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCallSessionStarted(event: any) {
  const cid = event.call?.cid || event.call_cid;
  console.log(`[Webhook] handleCallSessionStarted triggered for CID: ${cid}`);

  if (!cid) {
    console.error("[Webhook] No CID found in event", JSON.stringify(event, null, 2));
    return;
  }

  const [callType, meetingId] = cid.includes(':') ? cid.split(':') : ['default', cid];
  console.log(`[Webhook] Extracted callType: ${callType}, meetingId: ${meetingId}`);

  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    console.error("[Webhook] OPENAI_API_KEY is missing from environment");
    return;
  }

  try {
    // Try to find the meeting with a simple retry logic
    let meeting = null;
    let attempts = 0;
    while (attempts < 3 && !meeting) {
      meeting = await db.query.meetings.findFirst({
        where: (meetings, { eq }) => eq(meetings.id, meetingId),
        with: {
          agent: true
        }
      });
      if (!meeting) {
        attempts++;
        if (attempts < 3) {
          console.log(`[Webhook] Meeting ${meetingId} not found, retrying in 500ms... (Attempt ${attempts})`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    if (!meeting) {
      console.log(`[Webhook] CRITICAL: Meeting ${meetingId} NOT FOUND in database.`);
      const allMeetings = await db.select({ id: meetings.id }).from(meetings).limit(5);
      console.log(`[Webhook] Sample Meeting IDs in DB:`, allMeetings.map(m => m.id));
      return;
    }

    if (!meeting.agent) {
      console.log(`[Webhook] Meeting ${meetingId} found but HAS NO AGENT assigned.`);
      return;
    }

    if (meeting.status === "completed" || meeting.status === "cancelled") {
      console.log(`[Webhook] Meeting ${meetingId} is already ${meeting.status}. Skipping.`);
      return;
    }

    console.log(`[Webhook] Meeting found: ${meeting.name}. Agent: ${meeting.agent.name}. Status: ${meeting.status}`);

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("[Webhook] Stream API key or secret missing in environment");
      return;
    }

    const streamVideo = new StreamClient(apiKey, apiSecret);
    const agentUserId = `agent-${meeting.agent.id}`;
    const agentUserName = `${meeting.agent.name} (AI)`;

    console.log(`[Webhook] Upserting agent user: ${agentUserId}`);
    await streamVideo.upsertUsers([
      {
        id: agentUserId,
        name: agentUserName,
        role: "bot",
        image: `https://getstream.io/random_svg/?id=${agentUserId}&name=${agentUserName}`,
      },
    ]);

    const call = streamVideo.video.call(callType, meetingId);
    
    console.log(`[Webhook] Getting/Creating call: ${callType}:${meetingId}`);
    await call.getOrCreate({
      data: {
        created_by_id: meeting.userId,
      }
    });

    console.log(`[Webhook] Connecting OpenAI Realtime for agent: ${agentUserId}`);
    try {
      const realtimeClient = await streamVideo.video.connectOpenAi({
        call,
        openAiApiKey,
        agentUserId: agentUserId,
      });

      console.log(`[Webhook] OpenAI Realtime connected. Updating session...`);
      await realtimeClient.updateSession({
        instructions: meeting.agent.instructions || "You are a helpful meeting assistant.",
        modalities: ['text', 'audio'],
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      });
      console.log(`[Webhook] Agent session updated successfully for meeting: ${meeting.name}`);
    } catch (openaiErr: any) {
      console.error(`[Webhook] OpenAI Connection Failed for meeting ${meetingId}:`, openaiErr);
    }
  } catch (err) {
    console.error(`[Webhook] Error in handleCallSessionStarted for ${meetingId}:`, err);
  }
}

async function handleCallEnded(event: any) {
  const cid = event.call?.cid || event.call_cid;
  if (!cid) return;
  const callId = cid.split(':')[1];

  try {
    await db.update(meetings)
      .set({ 
        status: "completed",
        endedAt: new Date()
      })
      .where(eq(meetings.id, callId));
  } catch (err) {
    console.error("Failed to update meeting end status:", err);
  }
}

async function handleRecordingReady(event: any) {
  const cid = event.call?.cid || event.call_cid;
  if (!cid) return;
  const { url } = event.recording;
  const callId = cid.split(':')[1];

  try {
    await db.update(meetings)
      .set({ 
        recordingUrl: url,
        status: "processing" // Mark as processing for summary generation
      })
      .where(eq(meetings.id, callId));
      
    // Trigger summary generation logic here...
  } catch (err) {
    console.error("Failed to update recording URL:", err);
  }
}

async function handleParticipantLeft(event: any) {
  const cid = event.call?.cid || event.call_cid;
  if (!cid) return;
  const meetingId = cid.split(':')[1];

  try {
    // Logic to handle participant leaving
    // For example, if no more human participants are left, disconnect the AI agent
    console.log(`Participant left meeting: ${meetingId}`);
    
    // You can add logic here to check the number of participants and disconnect if needed
  } catch (err) {
    console.error("Failed to handle participant left event:", err);
  }
}
