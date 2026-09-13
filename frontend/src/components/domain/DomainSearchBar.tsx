"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, XCircle, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { domainsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

interface DomainSearchBarProps {
  initialQuery?: string;
  autoSearch?: boolean;
}

export function DomainSearchBar({ initialQuery = "", autoSearch = false }: DomainSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addItem, items } = useCart();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    try {
      setSearching(true);
      setError(null);
      const res = await domainsApi.search(query.trim());
      setResults(res.results);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to search domain availability.");
    } finally {
      setSearching(false);
    }
  };

  React.useEffect(() => {
    if (autoSearch && initialQuery) {
      handleSearch();
    }
  }, []);

  const isDomainInCart = (domainName: string) => {
    return items.some((i) => i.product_reference.toLowerCase() === domainName.toLowerCase());
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/5 p-1.5 transition-all focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500"
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

      {/* Popular TLD badges */}
      {!hasSearched && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Popular:</span>
          {[
            { tld: ".com", price: "₹899/yr" },
            { tld: ".in", price: "₹499/yr" },
            { tld: ".org", price: "₹999/yr" },
            { tld: ".io", price: "₹2,999/yr" },
          ].map((item) => (
            <button
              key={item.tld}
              type="button"
              onClick={() => {
                setQuery(`mybrand${item.tld}`);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800/80 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="font-bold">{item.tld}</span>
              <span className="text-slate-400 dark:text-slate-500 text-[10px]">{item.price}</span>
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
            <span>Registration Rate</span>
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
