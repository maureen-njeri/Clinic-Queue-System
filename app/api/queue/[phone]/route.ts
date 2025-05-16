import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import Patient from "@/models/Patient";

export async function GET(req: Request, { params }: { params: { phone: string } }) {
  await dbConnect();
  const patient = await Patient.findOne({ phone: params.phone });
  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const appointment = await Appointment.findOne({ patient: patient._id, status: "waiting" });
  const current = await Appointment.findOne({ status: "in-progress" });

  const currentQueue = current?.queueNumber || 0;
  const yourQueue = appointment?.queueNumber || null;

  return NextResponse.json({ currentQueue, yourQueue });
}
