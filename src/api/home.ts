import { pcapi, tcapi } from "./client";
import type { HomeDataRawResponse, ServiceBySubCategoryRawResponse } from "@/types/api";

/** POST tcapi/s_home_data.php { uid } — verified: OLD/homeService.getHomeData */
export async function getHomeData(uid: string) {
  const { data } = await tcapi.post<HomeDataRawResponse>(
    "s_home_data.php",
    { uid },
    { headers: { "Content-Type": "application/json" } },
  );
  return data;
}

/** GET pcapi/get_service_by_name.php?sid={subcatId} — verified: OLD/homeService.getServiceBySubCategory. Returns the packages/services for one subcategory. */
export async function getServiceBySubCategory(subcatId: string) {
  const { data } = await pcapi.get<ServiceBySubCategoryRawResponse>(
    `get_service_by_name.php?sid=${encodeURIComponent(subcatId)}`,
  );
  return data;
}
