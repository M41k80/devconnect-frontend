"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, X, AlertCircle } from "lucide-react";
import { ProjectStatus } from "@/app/types/enums";
import { useI18n } from "@/app/i18n";
import { CreateProjectDto } from "@/app/types/dtos";
import { projectsApi } from "@/app/lib/api";
import { Navbar } from "@/app/components/layout/Navbar";
import { cn } from "@/app/lib/utils";
import { Spinner } from "@/app/components/ui/Spinner";

const schema = z.object({
  title: z.string().min(1, "Required").max(100),
  description: z.string().min(10, "Min 10 characters").max(2000),
  status: z.nativeEnum(ProjectStatus).optional(),
  repositoryUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  docsUrl: z.string().url().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function NewProjectPage() {
  const { t } = useI18n();
  const router = useRouter();

  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: ProjectStatus.IDEA },
  });

  const selectedStatus = watch("status");

  const addTech = () => {
    const v = techInput.trim();
    if (v && !techStack.includes(v) && techStack.length < 20) {
      setTechStack((prev) => [...prev, v]);
      setTechInput("");
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setApiError("");
    try {
      const payload: CreateProjectDto = {
        title: values.title,
        description: values.description,
        techStack: techStack.length ? techStack : undefined,
        status: values.status,
        repositoryUrl: values.repositoryUrl || undefined,
        demoUrl: values.demoUrl || undefined,
        docsUrl: values.docsUrl || undefined,
      };
      const res = await projectsApi.create(payload);
      router.push(`/projects/${res.id}`);
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      setApiError(
        Array.isArray(msg) ? msg.join(", ") : (msg ?? t.common.error),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm mb-8 hover:text-[--brand] transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} /> {t.project.back}
          </Link>

          <div className="anim-fade-up">
            <h1 className="dc-page-title mb-1.5">{t.projects.createNew}</h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
              Share your project with the DevConnect community and find
              collaborators.
            </p>
          </div>

          {apiError && (
            <div
              className="flex items-center gap-2.5 p-3.5 rounded-xl border mb-6 text-sm anim-scale-in"
              style={{
                background: "color-mix(in srgb, var(--danger) 8%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--danger) 20%, transparent)",
                color: "var(--danger)",
              }}
            >
              <AlertCircle size={14} /> {apiError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 anim-fade-up delay-1"
          >
            <div>
              <label className="dc-label">Title *</label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Open Source Dashboard"
                className={cn("dc-input", errors.title && "dc-input-error")}
              />
              {errors.title && (
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--danger)" }}
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="dc-label">Description *</label>
              <textarea
                {...register("description")}
                rows={5}
                placeholder="Describe what you're building, the problem it solves, and the kind of contributors you're looking for…"
                className={cn(
                  "dc-input resize-none",
                  errors.description && "dc-input-error",
                )}
              />
              {errors.description && (
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--danger)" }}
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="dc-label">{t.projects.filterStatus}</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(ProjectStatus).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setValue("status", s)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-100",
                      selectedStatus === s
                        ? "text-white border-transparent"
                        : "border-[--border] text-[--text-muted] hover:border-[--brand] hover:text-[--brand]",
                    )}
                    style={
                      selectedStatus === s ? { background: "var(--brand)" } : {}
                    }
                  >
                    {t.status[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="dc-label">
                {t.project.techStack}
                <span
                  className="text-xs ml-1"
                  style={{ color: "var(--text-dim)" }}
                >
                  ({t.common.optional}, max 20)
                </span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="e.g. NestJS"
                  className="dc-input flex-1"
                />
                <button
                  type="button"
                  onClick={addTech}
                  disabled={!techInput.trim() || techStack.length >= 20}
                  className="dc-btn-ghost py-2.5 px-3.5 disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border"
                      style={{
                        color: "var(--accent)",
                        borderColor:
                          "color-mix(in srgb, var(--accent) 22%, transparent)",
                        background:
                          "color-mix(in srgb, var(--accent) 7%, transparent)",
                      }}
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setTechStack((p) => p.filter((t) => t !== tech))
                        }
                        className="hover:text-[--danger] transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  key: "repositoryUrl" as const,
                  label: t.project.repository,
                  placeholder: "https://github.com/…",
                },
                {
                  key: "demoUrl" as const,
                  label: t.project.demo,
                  placeholder: "https://…",
                },
                {
                  key: "docsUrl" as const,
                  label: t.project.docs,
                  placeholder: "https://docs.…",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="dc-label">
                    {label}{" "}
                    <span
                      className="text-xs ml-1"
                      style={{ color: "var(--text-dim)" }}
                    >
                      ({t.common.optional})
                    </span>
                  </label>
                  <input
                    {...register(key)}
                    type="url"
                    placeholder={placeholder}
                    className={cn(
                      "dc-input text-sm",
                      errors[key] && "dc-input-error",
                    )}
                  />
                  {errors[key] && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--danger)" }}
                    >
                      {errors[key]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="dc-btn-primary py-3 px-7 text-base"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" /> {t.common.loading}
                  </>
                ) : (
                  <>
                    <Plus size={16} /> {t.projects.createNew}
                  </>
                )}
              </button>
              <Link
                href="/projects"
                className="dc-btn-ghost py-3 px-7 text-base"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
