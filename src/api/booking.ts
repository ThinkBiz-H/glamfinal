import { pcapi, tcapi, pickMessage } from "./client";
import type {
  AddBookingPayload,
  AddBookingRawResponse,
  GetBookingRawResponse,
  TimeSlotRawResponse,
} from "@/types/api";

/** POST tcapi/s_timeslot.php { uid, cid } — verified: OLD/timeService.getTimeSlots */
export async function getTimeSlots(uid: string, cid: string) {
  const { data } = await tcapi.post<TimeSlotRawResponse>(
    "s_timeslot.php",
    { uid, cid },
    { headers: { "Content-Type": "application/json" } },
  );
  const ok = data.Result === "true";
  const block = data.TimeslotData?.[0];
  return {
    ok,
    message: pickMessage(data),
    days: block?.days ?? [],
    slots: block?.tslot ?? [],
  };
}

/** POST pcapi/add_booking.php — verified: OLD/authService.addBooking / Payment.jsx createBooking(). Do not change this payload shape. */
export async function addBooking(payload: AddBookingPayload) {
  const { data } = await pcapi.post<AddBookingRawResponse>("add_booking.php", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return {
    ok: Boolean(data.result),
    message: pickMessage(data),
    bookingId: data.booking_id,
    otp: data.otp,
  };
}

/** POST pcapi/get_booking.php { userid } — verified: OLD/authService.getBookings */
export async function getBookings(userid: string) {
  const { data } = await pcapi.post<GetBookingRawResponse>(
    "get_booking.php",
    { userid },
    { headers: { "Content-Type": "application/json" } },
  );
  return { ok: Boolean(data.result), bookings: data.data ?? [] };
}
