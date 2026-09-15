"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, XCircle, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export interface PopularTld {
  tld: string;
  price: number;
  renewal: number;
  tag?: string;
}

export const AUTHORITATIVE_TLDS: PopularTld[] = [
  { tld: ".com", price: 899, renewal: 999, tag: "Global" },
  { tld: ".in", price: 499, renewal: 599, tag: "India" },
  { tld: ".org", price: 999, renewal: 1099, tag: "Authority" },
  { tld: ".net", price: 949, renewal: 1049, tag: "Network" },
  { tld: ".io", price: 2999, renewal: 3199, tag: "Tech & SaaS" },
  { tld: ".tech", price: 599, renewal: 1299, tag: "Special" },
];

interface DomainSearchBarProps {
  initialQuery?: string;
  autoSearch?: boolean;
  showPopularBadges?: boolean;
}

export function DomainSearchBar({
  initialQuery = "",
  autoSearch = false,
  showPopularBadges = true,
}: DomainSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addItem, items } = useCart();

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = (customQuery !== undefined ? customQuery : query).trim();
    if (!q) return;

    try {
      setSearching(true);
      setError(null);
      const res = await domainsApi.search(q);
      setResults(res.results);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to search domain availability.");
    } finally {
      setSearching(false);
    }
  };

  const handleTldClick = (tld: string) => {
    const trimmed = query.trim();
    const base = trimmed ? trimmed.replace(/\.[a-z0-9.]+$/i, "") : "mybrand";
    const fullDomain = `${base}${tld}`;
    setQuery(fullDomain);
    handleSearch(undefined, fullDomain);
  };

  React.useEffect(() => {
    if (autoSearch && initialQuery) {
      handleSearch(undefined, initialQuery);
    }
  }, [initialQuery, autoSearch]);

  const isDomainInCart = (domainName: string) => {
    return items.some((i) => i.product_reference.toLowerCase() === domainName.toLowerCase());
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/5 p-1.5 transition-all focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500"
      >
        <div className="pl-3.5 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your perfect domain (e.g. mybrand, techstartup.com)"
          className="w-full bg-transparent px-3.5 py-2.5 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />
        <Button
          type="submit"
          size="md"
          loading={searching}
          className="shrink-0 px-6 h-11"
        >
          Search Domain
        </Button>
      </form>

      {/* Authoritative Single TLD Pricing Chips */}
      {!hasSearched && showPopularBadges && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
            Trending:
          </span>
          {AUTHORITATIVE_TLDS.map((item) => (
            <button
              key={item.tld}
              type="button"
              onClick={() => handleTldClick(item.tld)}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-medium shadow-sm hover:border-emerald-500/60 hover:shadow-md hover:bg-emerald-50/40 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
            >
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.tld}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {formatCurrency(item.price)}
              </span>
              <span className="text-[10px] text-slate-400 line-through">
                {formatCurrency(item.renewal)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
          {error}
        </div>
      )}

      {/* Results List */}
      {hasSearched && results.length > 0 && (
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between px-1 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Domain Availability Results</span>
            <button
              type="button"
              onClick={() => {
                setHasSearched(false);
                setResults([]);
              }}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline normal-case font-medium"
            >
              Clear Results
            </button>
          </div>
          {results.map((item) => {
            const inCart = isDomainInCart(item.domain_name);
            return (
              <div
                key={item.domain_name}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                  item.is_available
                    ? "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-brand-500/50"
                    : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-75"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.is_available ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-slate-900 dark:text-slate-100 text-base">
                        {item.domain_name}
                      </span>
                      {item.is_available ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="default">Taken</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Renews at {formatCurrency(item.renewal_price)}/year
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="font-display font-bold text-slate-900 dark:text-slate-100 text-lg">
                      {formatCurrency(item.registration_price)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">/first year</span>
                  </div>

                  {item.is_available ? (
                    <Button
                      size="sm"
                      variant={inCart ? "secondary" : "primary"}
                      onClick={() => {
                        if (!inCart) {
                          addItem({
                            product_type: "DOMAIN",
                            product_reference: item.domain_name,
                            name: `Domain: ${item.domain_name}`,
                            unit_price: item.registration_price,
                            meta_info: { tld: item.tld, renewal_price: item.renewal_price },
                          });
                        }
                      }}
                      className="min-w-[110px]"
                    >
                      {inCart ? (
                        <span className="flex items-center gap-1">In Cart ✓</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add to Cart
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="min-w-[110px]">
                      Unavailable
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
