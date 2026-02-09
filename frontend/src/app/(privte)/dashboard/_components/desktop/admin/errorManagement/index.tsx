"use client";

import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { GETERRORS, GETERRORSTATS, RESOLVEERROR, DELETEERROR } from "@/utils/constant";
import LoadingMiddle from "@/app/_components/ui/loading";

interface FrontendError {
  _id: string;
  userId?: string;
  userEmail?: string;
  errorMessage: string;
  errorStack?: string;
  errorType: "error" | "unhandledrejection" | "component";
  url: string;
  userAgent: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  metadata?: {
    componentStack?: string;
    lineNumber?: number;
    columnNumber?: number;
    filename?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

interface ErrorStats {
  total: number;
  unresolved: number;
  resolved: number;
  byType: Record<string, number>;
  last24Hours: number;
}

const ErrorManagement: React.FC = () => {
  const [errors, setErrors] = useState<FrontendError[]>([]);
  const [stats, setStats] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "resolved" | "unresolved">("unresolved");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const token = Cookies.get("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse = await axios.get(
        `${GETERRORS}?resolved=${filter === "resolved" ? "true" : filter === "unresolved" ? "false" : ""}&page=${page}&limit=20`,
        config
      );
      if (res.data.status === 200) {
        setErrors(res.data.errors);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch errors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Only show loading if stats already exist (updating), not on initial load
    if (stats) {
      setStatsLoading(true);
    }
    try {
      const res: AxiosResponse = await axios.get(GETERRORSTATS, config);
      if (res.data.status === 200) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [filter, page]);

  // Fetch stats on mount and when filter changes (to reflect current state)
  useEffect(() => {
    fetchStats();
  }, [filter]);

  const handleResolve = async (errorId: string, resolved: boolean) => {
    try {
      const res: AxiosResponse = await axios.put(
        `${RESOLVEERROR}${errorId}`,
        { resolved },
        config
      );
      if (res.status === 200) {
        // Update local state immediately for better UX
        setErrors((prev) =>
          prev.map((err) =>
            err._id === errorId ? { ...err, resolved, resolvedAt: resolved ? new Date().toISOString() : undefined } : err
          )
        );
        // Refresh stats since counts changed
        fetchStats();
        // Refresh errors to ensure consistency
        fetchErrors();
      }
    } catch (error) {
      console.error("Failed to resolve error:", error);
    }
  };

  const handleDelete = async (errorId: string) => {
    if (!confirm("Are you sure you want to delete this error?")) {
      return;
    }
    try {
      const res: AxiosResponse = await axios.delete(
        `${DELETEERROR}${errorId}`,
        config
      );
      if (res.status === 200) {
        // Remove from local state immediately
        setErrors((prev) => prev.filter((err) => err._id !== errorId));
        // Refresh stats since counts changed
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to delete error:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500/20 text-red-400";
      case "unhandledrejection":
        return "bg-orange-500/20 text-orange-400";
      case "component":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  // Only show full loading on initial load
  if (loading && errors.length === 0 && !stats) {
    return <LoadingMiddle />;
  }

  return (
    <div className="mt-[43px]">
      <h2 className="text-[32px] font-semibold uppercase tracking-wider mb-6">
        Frontend Error Management
      </h2>

      {/* Stats */}
      {stats && (
        <div className={`grid grid-cols-5 gap-4 mb-6 transition-opacity duration-200 ${statsLoading ? 'opacity-60' : 'opacity-100'}`}>
          <div className="bg-[#1E1E1E] p-4 rounded-lg">
            <div className="text-sm text-gray-400 uppercase mb-1">Total Errors</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg">
            <div className="text-sm text-gray-400 uppercase mb-1">Unresolved</div>
            <div className="text-2xl font-semibold text-red-400">{stats.unresolved}</div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg">
            <div className="text-sm text-gray-400 uppercase mb-1">Resolved</div>
            <div className="text-2xl font-semibold text-green-400">{stats.resolved}</div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg">
            <div className="text-sm text-gray-400 uppercase mb-1">Last 24h</div>
            <div className="text-2xl font-semibold">{stats.last24Hours}</div>
          </div>
          <div className="bg-[#1E1E1E] p-4 rounded-lg">
            <div className="text-sm text-gray-400 uppercase mb-1">By Type</div>
            <div className="text-xs mt-1">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="capitalize">{type}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFilter("all");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg uppercase tracking-wider ${
            filter === "all"
              ? "bg-blue text-white"
              : "bg-[#1E1E1E] text-gray-400 hover:text-white"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFilter("unresolved");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg uppercase tracking-wider ${
            filter === "unresolved"
              ? "bg-blue text-white"
              : "bg-[#1E1E1E] text-gray-400 hover:text-white"
          }`}
        >
          Unresolved
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFilter("resolved");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg uppercase tracking-wider ${
            filter === "resolved"
              ? "bg-blue text-white"
              : "bg-[#1E1E1E] text-gray-400 hover:text-white"
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Error List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading...
          </div>
        ) : errors.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No errors found
          </div>
        ) : (
          errors.map((error) => (
            <div
              key={error._id}
              className={`bg-[#1E1E1E] rounded-lg p-4 border-l-4 ${
                error.resolved ? "border-green-500" : "border-red-500"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs uppercase ${getErrorTypeColor(
                        error.errorType
                      )}`}
                    >
                      {error.errorType}
                    </span>
                    {error.resolved && (
                      <span className="px-2 py-1 rounded text-xs uppercase bg-green-500/20 text-green-400">
                        Resolved
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatDate(error.timestamp)}
                    </span>
                  </div>
                  <div className="text-lg font-semibold mb-1">
                    {error.errorMessage}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {error.userEmail || "Anonymous"} • {error.url}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!error.resolved && (
                    <button
                      onClick={() => handleResolve(error._id, true)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 uppercase text-xs"
                    >
                      Resolve
                    </button>
                  )}
                  {error.resolved && (
                    <button
                      onClick={() => handleResolve(error._id, false)}
                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 uppercase text-xs"
                    >
                      Unresolve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(error._id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 uppercase text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  setExpandedError(expandedError === error._id ? null : error._id)
                }
                className="text-sm text-blue hover:underline mb-2"
              >
                {expandedError === error._id ? "Hide Details" : "Show Details"}
              </button>

              {expandedError === error._id && (
                <div className="mt-4 space-y-3 text-sm">
                  {error.errorStack && (
                    <div>
                      <div className="text-gray-400 uppercase mb-1">Stack Trace</div>
                      <pre className="bg-[#0a0a0a] p-3 rounded overflow-auto text-xs">
                        {error.errorStack}
                      </pre>
                    </div>
                  )}
                  {error.metadata?.componentStack && (
                    <div>
                      <div className="text-gray-400 uppercase mb-1">Component Stack</div>
                      <pre className="bg-[#0a0a0a] p-3 rounded overflow-auto text-xs">
                        {error.metadata.componentStack}
                      </pre>
                    </div>
                  )}
                  {error.metadata && Object.keys(error.metadata).length > 0 && (
                    <div>
                      <div className="text-gray-400 uppercase mb-1">Metadata</div>
                      <pre className="bg-[#0a0a0a] p-3 rounded overflow-auto text-xs">
                        {JSON.stringify(error.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-400 uppercase mb-1">User Agent</div>
                    <div className="text-xs text-gray-300">{error.userAgent}</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#1E1E1E] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2e2e2e]"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="px-4 py-2 bg-[#1E1E1E] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2e2e2e]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorManagement;

