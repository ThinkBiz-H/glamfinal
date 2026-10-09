import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import * as authApi from "@/api/auth";
import * as addressApi from "@/api/address";
import * as cartApi from "@/api/cart";
import * as bookingApi from "@/api/booking";
import * as walletApi from "@/api/wallet";
import * as referApi from "@/api/refer";
import { apiErrorMessage, resolveUserId } from "@/api/client";
import type { AddressRow, BookingRow, RawUser } from "@/types/api";

export type User = RawUser;
export type Address = AddressRow;
export type Booking = BookingRow;

/** One line in the real, server-persisted cart (pcapi/get_cart.php). */
export type CartLine = {
  productId: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

const SESSION_KEY = "glamride:user";
// Mirrors OLD's single global localStorage "cid" — the app only ever books
// services from one category/subcategory context at a time (verified: OLD
// sets this in ServiceDetails.jsx, SubCategorySection.jsx, PackageDetails.jsx,
// PackageDetail.jsx, and reads it in Cart/DateTime/Checkout/Payment).
const CID_KEY = "glamride:cid";

type Ctx = {
  // ---- Auth (OTP only — this is the backend's only login mechanism) ----
  user: User | null;
  hydrated: boolean;
  sendOtp: (mobile: string) => Promise<{ ok: boolean; message: string }>;
  verifyOtp: (mobile: string, otp: string) => Promise<{ ok: boolean; message: string }>;
  checkMobile: (mobile: string) => Promise<{ ok: boolean; message: string }>;
  registerUser: (input: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    refercode?: string;
  }) => Promise<{ ok: boolean; message: string }>;
  updateProfile: (params: {
    name: string;
    password: string;
  }) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;

  // ---- Category context (mirrors OLD's localStorage "cid") ----
  activeCid: string;
  setActiveCid: (cid: string) => void;

  // ---- Cart (real server cart — pcapi/get_cart.php + add_to_cart.php) ----
  cart: CartLine[];
  cartLoading: boolean;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (item: {
    productId: string;
    title: string;
    price: number;
    image: string;
  }) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;

  // ---- Addresses ----
  addresses: Address[];
  addressesLoading: boolean;
  addAddress: (a: {
    id?: string;
    houseno: string;
    landmark: string;
    address: string;
    city: string;
    pincode: string;
    type: string;
    lat_map?: string;
    long_map?: string;
  }) => Promise<{ ok: boolean; message: string }>;

  // ---- Time slots (per category context) ----
  getTimeSlots: () => Promise<{ ok: boolean; days: string[]; slots: string[]; message: string }>;

  // ---- Booking creation + history ----
  placeBooking: (payload: {
    address: Address;
    date: string;
    time: string;
    paymentStatus: "Cash" | "Online";
    transactionId?: string;
  }) => Promise<{
    ok: boolean;
    message: string;
    bookingId?: string | number;
    otp?: string | number;
  }>;
  bookings: Booking[];
  bookingsLoading: boolean;
  refreshBookings: () => void;

  // ---- Wallet ----
  walletBalance: string;
  walletCredit: string;
  walletDebit: string;
  walletItems: { message: string; status: string; amt: string | number }[];
  walletLoading: boolean;

  // ---- Refer ----
  referCode: string;
  signupCredit: string;
  referCredit: string;
  referLoading: boolean;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeCid, setActiveCidState] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
      const cid = localStorage.getItem(CID_KEY);
      if (cid) setActiveCidState(cid);
    } catch {
      /* ignore corrupt/missing session */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [user, hydrated]);

  const setActiveCid = useCallback((cid: string) => {
    setActiveCidState(cid);
    try {
      localStorage.setItem(CID_KEY, cid);
    } catch {
      /* ignore */
    }
  }, []);

  const uid = resolveUserId(user);

  // ---- Auth --------------------------------------------------------------
  const sendOtp = useCallback(async (mobile: string) => {
    try {
      const res = await authApi.sendOtp(mobile);
      return { ok: res.ok, message: res.message };
    } catch (err) {
      return { ok: false, message: apiErrorMessage(err) };
    }
  }, []);

  const verifyOtp = useCallback(async (mobile: string, otp: string) => {
    try {
      const res = await authApi.verifyOtp(mobile, otp);
      if (res.ok && res.user) setUser(res.user);
      return { ok: res.ok && Boolean(res.user), message: res.message };
    } catch (err) {
      return { ok: false, message: apiErrorMessage(err) };
    }
  }, []);

  const checkMobile = useCallback(async (mobile: string) => {
    try {
      const res = await authApi.checkMobile(mobile);
      return { ok: res.ok, message: res.message };
    } catch (err) {
      return { ok: false, message: apiErrorMessage(err) };
    }
  }, []);

  const registerUser = useCallback(
    async (input: {
      name: string;
      email: string;
      mobile: string;
      password: string;
      refercode?: string;
    }) => {
      try {
        const res = await authApi.registerUser(input);
        return { ok: res.ok, message: res.message };
      } catch (err) {
        return { ok: false, message: apiErrorMessage(err) };
      }
    },
    [],
  );

  const updateProfile = useCallback(
    async (params: { name: string; password: string }) => {
      if (!uid) return { ok: false, message: "Please sign in." };
      try {
        const res = await authApi.updateProfile({ uid, ...params });
        if (res.ok && res.user) setUser(res.user);
        return { ok: res.ok, message: res.message };
      } catch (err) {
        return { ok: false, message: apiErrorMessage(err) };
      }
    },
    [uid],
  );

  const logout = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  // ---- Cart (real server cart) --------------------------------------------
  const cartQuery = useQuery({
    queryKey: ["cart", uid],
    queryFn: () => cartApi.getCart(uid),
    enabled: Boolean(uid),
  });

  const cart: CartLine[] = useMemo(() => {
    const items = cartQuery.data?.cart_items ?? [];
    if (!cartQuery.data?.success || !Array.isArray(items)) return [];
    return items.map((item) => ({
      productId: String(item.product_id),
      title: item.product_name,
      price: Number(item.product_price) || 0,
      image: item.product_image,
      qty: Number(item.quantity) || 0,
    }));
  }, [cartQuery.data]);

  const refreshCart = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["cart", uid] });
  }, [queryClient, uid]);

  const addToCart = useCallback(
    async (item: { productId: string; title: string; price: number; image: string }) => {
      if (!uid) return;
      const existing = cart.find((c) => c.productId === item.productId);
      const nextQty = (existing?.qty ?? 0) + 1;
      await cartApi.addToCartApi({
        user_id: uid,
        product_id: item.productId,
        product_name: item.title,
        product_price: item.price,
        product_image: item.image,
        quantity: nextQty,
      });
      await refreshCart();
    },
    [uid, cart, refreshCart],
  );

  const setQty = useCallback(
    async (productId: string, qty: number) => {
      if (!uid) return;
      const line = cart.find((c) => c.productId === productId);
      if (!line) return;
      await cartApi.addToCartApi({
        user_id: uid,
        product_id: productId,
        product_name: line.title,
        product_price: line.price,
        product_image: line.image,
        quantity: Math.max(0, qty),
      });
      await refreshCart();
    },
    [uid, cart, refreshCart],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      await setQty(productId, 0);
    },
    [setQty],
  );

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, l) => sum + l.price * l.qty, 0), [cart]);

  // ---- Addresses -----------------------------------------------------------
  const addressesQuery = useQuery({
    queryKey: ["addresses", uid],
    queryFn: () => addressApi.getAddressList(uid),
    enabled: Boolean(uid),
  });
  const addresses = useMemo(() => addressesQuery.data?.list ?? [], [addressesQuery.data]);

  const addAddress = useCallback(
    async (a: {
      id?: string;
      houseno: string;
      landmark: string;
      address: string;
      city: string;
      pincode: string;
      type: string;
      lat_map?: string;
      long_map?: string;
    }) => {
      if (!uid) return { ok: false, message: "Please sign in." };
      const res = await addressApi.saveAddress({
        uid,
        aid: a.id ?? 0,
        houseno: a.houseno,
        landmark: a.landmark,
        address: a.address,
        city: a.city,
        pincode: a.pincode,
        type: a.type,
        lat_map: a.lat_map ?? "0",
        long_map: a.long_map ?? "0",
      });
      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["addresses", uid] });
      }
      return res;
    },
    [uid, queryClient],
  );

  // ---- Time slots ------------------------------------------------------------
  const getTimeSlots = useCallback(async () => {
    if (!uid || !activeCid) {
      return { ok: false, days: [], slots: [], message: "Missing user or category context." };
    }
    const res = await bookingApi.getTimeSlots(uid, activeCid);
    return res;
  }, [uid, activeCid]);

  // ---- Booking creation ------------------------------------------------------
  const placeBooking = useCallback(
    async (payload: {
      address: Address;
      date: string;
      time: string;
      paymentStatus: "Cash" | "Online";
      transactionId?: string;
    }) => {
      if (!uid || cart.length === 0) return { ok: false, message: "Your cart is empty." };

      const gst = Number((cartSubtotal * 0.18).toFixed(2));
      const finalAmount = Math.round(cartSubtotal + 100 + gst);

      const fullAddress = [
        payload.address.hno,
        payload.address.landmark,
        payload.address.address,
        payload.address.city,
        payload.address.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      const res = await bookingApi.addBooking({
        child_serviceid: cart.map((c) => c.productId).join(","),
        main_serviceid: cart[0].productId,
        userid: uid,
        payment_status: payload.paymentStatus,
        booking_date_time: `${payload.date} ${payload.time}`,
        user_address: fullAddress,
        booking_status: "0",
        user_lat_long: `${payload.address.lat_map || ""},${payload.address.long_map || ""}`,
        final_amount: finalAmount,
      });

      if (res.ok) {
        // No bulk-clear endpoint exists — mirror OLD's Payment.jsx behavior
        // of zeroing out every line item individually after a successful
        // booking.
        for (const item of cart) {
          await cartApi.addToCartApi({
            user_id: uid,
            product_id: item.productId,
            product_name: item.title,
            product_price: item.price,
            product_image: item.image,
            quantity: 0,
          });
        }
        await refreshCart();
        queryClient.invalidateQueries({ queryKey: ["bookings", uid] });
      }

      return { ok: res.ok, message: res.message, bookingId: res.bookingId, otp: res.otp };
    },
    [uid, cart, cartSubtotal, refreshCart, queryClient],
  );

  const bookingsQuery = useQuery({
    queryKey: ["bookings", uid],
    queryFn: () => bookingApi.getBookings(uid),
    enabled: Boolean(uid),
  });
  const bookings = useMemo(() => bookingsQuery.data?.bookings ?? [], [bookingsQuery.data]);
  const refreshBookings = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bookings", uid] });
  }, [queryClient, uid]);

  // ---- Wallet ----------------------------------------------------------
  const walletQuery = useQuery({
    queryKey: ["wallet", uid],
    queryFn: () => walletApi.getWalletReport(uid),
    enabled: Boolean(uid),
  });

  // ---- Refer -------------------------------------------------------------
  const referQuery = useQuery({
    queryKey: ["refer", uid],
    queryFn: () => referApi.getReferData(uid),
    enabled: Boolean(uid),
  });

  const value: Ctx = {
    user,
    hydrated,
    sendOtp,
    verifyOtp,
    checkMobile,
    registerUser,
    updateProfile,
    logout,

    activeCid,
    setActiveCid,

    cart,
    cartLoading: cartQuery.isLoading,
    cartCount,
    cartSubtotal,
    addToCart,
    setQty,
    removeFromCart,
    refreshCart,

    addresses,
    addressesLoading: addressesQuery.isLoading,
    addAddress,

    getTimeSlots,

    placeBooking,
    bookings,
    bookingsLoading: bookingsQuery.isLoading,
    refreshBookings,

    walletBalance: String(walletQuery.data?.balance ?? "0"),
    walletCredit: String(walletQuery.data?.credittotal ?? "0"),
    walletDebit: String(walletQuery.data?.debittotal ?? "0"),
    walletItems: walletQuery.data?.items ?? [],
    walletLoading: walletQuery.isLoading,

    referCode: referQuery.data?.code ?? "",
    signupCredit: String(referQuery.data?.signupcredit ?? "0"),
    referCredit: String(referQuery.data?.refercredit ?? "0"),
    referLoading: referQuery.isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
