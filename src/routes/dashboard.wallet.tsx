import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/site/primitives";
import { inr } from "@/data/catalog";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/dashboard/wallet")({
  head: () => ({
    meta: [
      { title: "GlamRide Wallet | GlamRide" },
      {
        name: "description",
        content: "Check your GlamRide wallet balance and transaction history.",
      },
      { property: "og:title", content: "GlamRide Wallet" },
      { property: "og:description", content: "Your wallet balance and transaction history." },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const { walletBalance, walletItems, walletCredit, walletDebit, walletLoading } = useApp();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Wallet</h1>
      <p className="mt-2 text-muted-foreground">
        Refunds and cashback land here instantly and can be used on any booking.
      </p>

      <div className="mt-6 rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-lift">
        <p className="flex items-center gap-2 text-sm text-primary-foreground/85">
          <WalletIcon className="size-4" /> Available balance
        </p>
        <p className="mt-2 font-display text-4xl font-semibold">
          {walletLoading ? (
            <Loader2 className="size-7 animate-spin" />
          ) : (
            inr(Number(walletBalance || 0))
          )}
        </p>
        {!walletLoading && (
          <div className="mt-4 flex gap-6 text-sm text-primary-foreground/85">
            <span>Credited: {inr(walletCredit)}</span>
            <span>Debited: {inr(walletDebit)}</span>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Transaction history</h2>
        {walletLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading transactions…
          </div>
        ) : walletItems.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={WalletIcon}
              title="No transactions yet"
              body="Cashback, refunds and referral rewards will show up here."
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {walletItems.map((t, i) => {
              const credit = /credit/i.test(t.status);
              return (
                <li
                  key={`${t.message}-${i}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-9 place-items-center rounded-full ${credit ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {credit ? (
                        <ArrowDownLeft className="size-4" />
                      ) : (
                        <ArrowUpRight className="size-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t.message || "Wallet transaction"}</p>
                      <p className="text-xs text-muted-foreground">{t.status}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${credit ? "text-primary" : ""}`}>
                    {inr(Math.abs(Number(t.amt)))}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
