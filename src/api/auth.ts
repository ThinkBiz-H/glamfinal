import { pcapi, tcapi, isSuccess, pickMessage } from "./client";
import type {
  MobileCheckRawResponse,
  RawUser,
  RegisterPayload,
  RegisterRawResponse,
  SendOtpRawResponse,
  UpdateProfileRawResponse,
  VerifyOtpRawResponse,
} from "@/types/api";

/** POST pcapi/send_otp_user.php { action: "send_otp", mobile } — verified: OLD/authService.sendOtp */
export async function sendOtp(mobile: string) {
  const { data } = await pcapi.post<SendOtpRawResponse>(
    "send_otp_user.php",
    { action: "send_otp", mobile },
    { headers: { "Content-Type": "application/json" } },
  );
  return { ok: isSuccess(data), message: pickMessage(data), raw: data };
}

/** POST pcapi/send_otp_user.php { action: "verify_otp", mobile, otp } — verified: OLD/authService.verifyOtp */
export async function verifyOtp(mobile: string, otp: string) {
  const { data } = await pcapi.post<VerifyOtpRawResponse>(
    "send_otp_user.php",
    { action: "verify_otp", mobile, otp },
    { headers: { "Content-Type": "application/json" } },
  );
  const user: RawUser | null = data.user ?? data.UserLogin ?? null;
  return { ok: isSuccess(data), message: pickMessage(data), user };
}

/** POST tcapi/s_mobile_check.php — verified: OLD/authService.checkMobile. Result "false" means the mobile is already registered. */
export async function checkMobile(mobile: string) {
  const { data } = await tcapi.post<MobileCheckRawResponse>("s_mobile_check.php", {
    mobile,
    ccode: "+91",
  });
  return { ok: isSuccess(data), message: pickMessage(data) };
}

/** POST tcapi/s_reg_user.php — verified: OLD/authService.registerUser */
export async function registerUser(payload: RegisterPayload) {
  const { data } = await tcapi.post<RegisterRawResponse>("s_reg_user.php", {
    name: payload.name,
    email: payload.email,
    mobile: payload.mobile,
    password: payload.password,
    ccode: payload.ccode ?? "+91",
    refercode: payload.refercode ?? "",
    token: payload.token ?? "",
  });
  return { ok: isSuccess(data), message: pickMessage(data) };
}

/** POST tcapi/s_profile.php { uid, name, password } — verified: OLD/authService.updateProfile. Backend requires BOTH name and password every time. */
export async function updateProfile(params: { uid: string; name: string; password: string }) {
  const { data } = await tcapi.post<UpdateProfileRawResponse>("s_profile.php", params);
  const user: RawUser | null = data.UserLogin ?? data.user ?? null;
  return { ok: isSuccess(data), message: pickMessage(data), user };
}
