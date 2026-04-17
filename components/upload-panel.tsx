"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { FileUp, LoaderCircle } from "lucide-react";

import { MAX_UPLOAD_SIZE_MB } from "@/lib/constants";

export function UploadPanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelect() {
    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      setError(`Please upload a file smaller than ${MAX_UPLOAD_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json();
        setError(payload.error || "Could not create the map.");
        return;
      }

      const payload = await response.json();
      router.push(`/maps/${payload.mapId}`);
      router.refresh();
    });
  }

  return (
    <div className="panel p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">New map</p>
          <h2 className="mt-3 font-display text-4xl leading-tight">
            Drop in a PDF, DOCX, or PPTX and let Cranium build the structure.
          </h2>
          <p className="mt-4 text-slate-600">
            We extract the key concepts, generate a relationship map, and prepare revision tools in one flow.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSelect}
          disabled={isPending}
          className="group relative flex min-h-44 w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-6 text-center transition hover:border-slate-500 hover:bg-white"
        >
          {isPending ? (
            <div className="flex w-full flex-col items-center gap-4 px-6">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <style jsx>{`
                  @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                  }
                  .animate-loading {
                    animation: loading-bar 2s infinite ease-in-out;
                    width: 100%;
                  }
                `}</style>
                <div className="animate-loading absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" />
              </div>
            </div>
          ) : (
            <FileUp className="h-8 w-8 text-slate-500 transition-transform group-hover:-translate-y-1" />
          )}
          <span className="mt-4 text-lg font-semibold text-slate-700">
            {isPending ? "Generating your mind map..." : "Upload document"}
          </span>
          <span className="mt-2 text-sm text-slate-500">
            {isPending ? "This may take a minute for larger files" : `PDF, DOCX, or PPTX up to ${MAX_UPLOAD_SIZE_MB}MB`}
          </span>
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      <input ref={inputRef} type="file" accept=".pdf,.docx,.pptx" className="hidden" onChange={handleChange} />
    </div>
  );
}
