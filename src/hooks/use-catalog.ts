import { useQuery } from "@tanstack/react-query";
import * as homeApi from "@/api/home";
import {
  toUiCategory,
  toUiPackage,
  toUiTile,
  type UiCategory,
  type UiPackage,
  type UiTile,
} from "@/data/catalog";

// OLD's home feed is fetched with a hardcoded uid ("70") regardless of
// whether anyone is signed in (verified: OLD/homeService.getHomeData sends
// `{ uid: "70" }` unconditionally) — browsing the catalog never required a
// real signed-in id. Kept identical here rather than "fixed", since we do
// not know whether that literal value has any server-side significance.
const HOME_FEED_UID = "70";

/** tcapi/s_home_data.php — verified: OLD/homeService.getHomeData */
export function useHomeData() {
  const query = useQuery({
    queryKey: ["home-data"],
    queryFn: () => homeApi.getHomeData(HOME_FEED_UID),
  });

  const result = query.data?.ResultData;
  const categories: UiCategory[] = (result?.Catlist ?? []).map(toUiCategory);
  const banners = result?.Banner ?? [];
  const subcatSections = result?.Subcat_section ?? [];

  return { ...query, categories, banners, subcatSections };
}

/**
 * Finds the Subcat_section whose first subcat item belongs to the given
 * top-level category — this is exactly OLD's ServiceDetails.jsx matching
 * logic (`item.subcat_data[0].cat_id === catId`), not a redesigned lookup.
 */
export function useCategorySection(catId: string | undefined) {
  const { subcatSections, isLoading, isError } = useHomeData();
  const section = subcatSections.find(
    (s) => s.subcat_data.length > 0 && String(s.subcat_data[0].cat_id) === String(catId),
  );
  const tiles: UiTile[] = (section?.subcat_data ?? []).map(toUiTile);
  return { section, tiles, isLoading, isError };
}

/** GET pcapi/get_service_by_name.php?sid={subcatId} — verified: OLD/homeService.getServiceBySubCategory */
export function usePackagesForSubcategory(subcatId: string | undefined, catId: string | undefined) {
  const query = useQuery({
    queryKey: ["packages", subcatId],
    queryFn: () => homeApi.getServiceBySubCategory(subcatId as string),
    enabled: Boolean(subcatId),
  });
  const packages: UiPackage[] = (query.data?.services ?? []).map((row) =>
    toUiPackage(row, subcatId ?? "", catId ?? ""),
  );
  return { ...query, packages };
}
