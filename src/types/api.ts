// Type definitions for the GlamRide PHP backend (https://theglamride.com/gram_ride/).
//
// IMPORTANT — provenance: every shape in this file is copied directly from
// field names actually read/written by OLD/webapp/src/services/*.js and
// OLD/webapp/src/pages/**/*.jsx (the shipped, working reference app), NOT
// guessed and NOT copied from the previous redesign's unverifiable claims.
// Two API prefixes are both real and both used by the working app:
//   - pcapi/  -> OTP auth, cart, booking creation, booking history
//   - tcapi/  -> home feed, address, profile, timeslot, payment gateway,
//                wallet, referral
//
// The backend's success/message fields are inconsistently cased across
// endpoints (Result vs result, ResponseMsg vs responseMsg, etc.) — the OLD
// app defensively checks multiple variants in different places. Rather than
// "fix" this into a single contract (which would be an invented change),
// api/client.ts's isSuccess()/pickMessage() helpers check every variant
// actually observed in the OLD source, so callers get parity with the
// current production behavior.

export interface ApiResult<T = unknown> {
  ok: boolean;
  message: string;
  data: T;
}

// ---------------------------------------------------------------------------
// Auth — OTP login (pcapi/send_otp_user.php), register/profile (tcapi)
// ---------------------------------------------------------------------------

/** Shape of the `user` object OLD stores in localStorage after OTP verify / register. Field set is whatever the backend returns under UserLogin/user — kept loose since OLD itself does not validate this shape beyond reading name/email/mobile/id. */
export interface RawUser {
  id?: string;
  uid?: string;
  name?: string;
  email?: string;
  mobile?: string;
  code?: string;
  [key: string]: unknown;
}

/** POST pcapi/send_otp_user.php { action: "send_otp", mobile } */
export interface SendOtpRawResponse {
  result?: string;
  Result?: string;
  responseMsg?: string;
  ResponseMsg?: string;
  [key: string]: unknown;
}

/** POST pcapi/send_otp_user.php { action: "verify_otp", mobile, otp } */
export interface VerifyOtpRawResponse {
  result?: string;
  Result?: string;
  responseMsg?: string;
  ResponseMsg?: string;
  user?: RawUser;
  UserLogin?: RawUser;
  [key: string]: unknown;
}

/** POST tcapi/s_mobile_check.php { mobile, ccode } */
export interface MobileCheckRawResponse {
  Result?: string;
  result?: string;
  ResponseMsg?: string;
  responseMsg?: string;
}

/** POST tcapi/s_reg_user.php */
export interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  ccode?: string;
  refercode?: string;
  token?: string;
}

export interface RegisterRawResponse {
  Result?: string;
  result?: string;
  ResponseMsg?: string;
  responseMsg?: string;
}

/** POST tcapi/s_profile.php { uid, name, password } — both name AND password required by the backend every time (verified: EditProfile.jsx always sends both). */
export interface UpdateProfileRawResponse {
  Result?: string;
  result?: string;
  ResponseMsg?: string;
  responseMsg?: string;
  UserLogin?: RawUser;
  user?: RawUser;
}

// ---------------------------------------------------------------------------
// Home feed (tcapi/s_home_data.php) — only fields OLD's Home.jsx / ServiceDetails.jsx / SubCategorySection.jsx / CategoryGrid.jsx actually read
// ---------------------------------------------------------------------------

export interface BannerRow {
  id: string | number;
  img: string;
  cat_name?: string;
  cat_subtitle?: string;
  [key: string]: unknown;
}

export interface CategoryRow {
  cat_id: string;
  cat_name: string;
  [key: string]: unknown;
}

export interface SubcatSectionItem {
  subcat_id: string;
  cat_id: string;
  img: string;
  title: string;
  [key: string]: unknown;
}

export interface SubcatSection {
  cat_name: string;
  cat_subtitle?: string;
  subcat_data: SubcatSectionItem[];
}

export interface HomeDataResult {
  Banner: BannerRow[];
  Catlist: CategoryRow[];
  Subcat_section: SubcatSection[];
  [key: string]: unknown;
}

export interface HomeDataRawResponse {
  ResponseCode?: string;
  ResultData?: HomeDataResult;
}

// ---------------------------------------------------------------------------
// Packages / services within a subcategory (pcapi/get_service_by_name.php, pcapi/get_service_detail.php)
// ---------------------------------------------------------------------------

/** One package/service row, as read by OLD's PackageDetails.jsx / PackageDetail.jsx. */
export interface ServiceRow {
  id: string | number;
  title: string;
  img: string;
  price: string | number;
  discount?: string | number;
  mqty?: string | number;
  mid?: string | number; // fallback category id used by OLD when navigating onward
  ttken?: string; // short duration/label string shown next to the discount badge
  sdesc?: string; // HTML description, rendered with dangerouslySetInnerHTML in OLD
  [key: string]: unknown;
}

/** GET pcapi/get_service_by_name.php?sid={subcatId} */
export interface ServiceBySubCategoryRawResponse {
  services?: ServiceRow[];
  [key: string]: unknown;
}

/** POST pcapi/get_service_detail.php { id } — defined in OLD but never actually invoked by any routed page (PackageDetail gets its service from router state instead). Kept only for completeness/parity; not wired into any UI here either, for the same reason. */
export interface ServiceDetailRawResponse {
  ResponseCode?: string;
  service?: ServiceRow;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Cart (pcapi/get_cart.php, pcapi/add_to_cart.php) — real, server-persisted cart
// ---------------------------------------------------------------------------

export interface CartItemRow {
  product_id: string | number;
  product_name: string;
  product_price: string | number;
  product_image: string;
  quantity: string | number;
  subtotal?: string | number;
  sid?: string;
  [key: string]: unknown;
}

/** GET pcapi/get_cart.php?user_id={uid} */
export interface GetCartRawResponse {
  success?: boolean;
  cart_items?: CartItemRow[];
  grand_total?: string | number;
  [key: string]: unknown;
}

/** POST pcapi/add_to_cart.php (multipart/form-data) — quantity: 0 removes the line. This is the ONLY cart mutation the backend exposes: no separate delete endpoint. */
export interface AddToCartPayload {
  user_id: string;
  product_id: string | number;
  product_name: string;
  product_price: string | number;
  product_image: string;
  quantity: number;
}

export interface AddToCartRawResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Address (tcapi/s_address_list.php, tcapi/s_address_user.php)
// ---------------------------------------------------------------------------

export interface AddressRow {
  id: string | number;
  type: string; // "Home" | "Office" | "Other" (icon lookup only, not a closed enum server-side)
  hno?: string;
  landmark?: string;
  address: string;
  city?: string;
  pincode?: string;
  lat_map?: string;
  long_map?: string;
  [key: string]: unknown;
}

export interface AddressListRawResponse {
  Result?: string;
  result?: string;
  AddressList?: AddressRow[];
  addressList?: AddressRow[];
  [key: string]: unknown;
}

/** POST tcapi/s_address_user.php — aid: 0 to create, existing id to update. */
export interface SaveAddressPayload {
  uid: string;
  aid: string | number;
  houseno: string;
  landmark: string;
  address: string;
  city: string;
  pincode: string;
  type: string;
  lat_map: string;
  long_map: string;
}

export interface SaveAddressRawResponse {
  Result?: string;
  ResponseMsg?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Time slots (tcapi/s_timeslot.php)
// ---------------------------------------------------------------------------

export interface TimeslotBlock {
  days: string[];
  tslot: string[];
  [key: string]: unknown;
}

/** POST tcapi/s_timeslot.php { uid, cid } */
export interface TimeSlotRawResponse {
  Result?: string;
  ResponseMsg?: string;
  TimeslotData?: TimeslotBlock[];
}

// ---------------------------------------------------------------------------
// Payment gateway (tcapi/s_paymentgateway.php) + Razorpay
// ---------------------------------------------------------------------------

export interface PaymentGatewayRow {
  id?: string | number;
  title?: string;
  name?: string;
  attributes?: string;
  mAttributes?: string;
  payment_key?: string;
  [key: string]: unknown;
}

/** POST tcapi/s_paymentgateway.php {} */
export interface PaymentGatewayRawResponse {
  Result?: string;
  data?: PaymentGatewayRow[];
}

// ---------------------------------------------------------------------------
// Booking creation (pcapi/add_booking.php) + history (pcapi/get_booking.php)
// ---------------------------------------------------------------------------

/** Exact payload shape built by OLD's Payment.jsx createBooking(). Do not add/remove/rename fields without re-verifying against that source. */
export interface AddBookingPayload {
  child_serviceid: string; // comma-joined cart item ids
  main_serviceid: string | number; // first cart item's id
  userid: string;
  payment_status: "Cash" | "Online";
  booking_date_time: string; // `${date} ${time}`
  user_address: string; // comma-joined address parts
  booking_status: "0";
  user_lat_long: string; // `${lat},${long}`
  final_amount: number;
}

export interface AddBookingRawResponse {
  result?: boolean;
  responseMsg?: string;
  message?: string;
  booking_id?: string | number;
  otp?: string | number;
  [key: string]: unknown;
}

export interface BookingServiceRow {
  id: string | number;
  title: string;
  subTitle?: string;
  img: string;
  price: string | number;
  [key: string]: unknown;
}

export interface BookingRow {
  id: string | number;
  main_serviceid?: string | number;
  services?: BookingServiceRow[];
  final_amount: string | number;
  booking_date_time: string;
  payment_status: string;
  user_address: string;
  otp?: string | number;
  [key: string]: unknown;
}

/** POST pcapi/get_booking.php { userid } */
export interface GetBookingRawResponse {
  result?: boolean;
  data?: BookingRow[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Wallet (tcapi/s_wallet_report.php)
// ---------------------------------------------------------------------------

export interface WalletItemRow {
  message: string;
  status: string;
  amt: string | number;
  [key: string]: unknown;
}

export interface WalletReportRawResponse {
  Result?: string;
  result?: boolean;
  ResponseCode?: string;
  wallet?: string | number;
  credittotal?: string | number;
  debittotal?: string | number;
  Walletitem?: WalletItemRow[];
}

// ---------------------------------------------------------------------------
// Refer & earn (tcapi/getdata.php)
// ---------------------------------------------------------------------------

export interface ReferDataRawResponse {
  Result?: string;
  result?: boolean;
  ResponseCode?: string;
  code?: string;
  signupcredit?: string | number;
  refercredit?: string | number;
}
