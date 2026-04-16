"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/app/i18n";
import { useAuthStore } from "@/app/store/auth.store";
import { projectsApi } from "@/app/lib/api";
import { formatDate } from "@/app/lib/utils";
import { ProjectStatusBadge } from "@/app/components/ui/Badge";
import { Avatar } from "@/app/components/ui/Avatar";
import { Spinner } from "@/app/components/ui/Spinner";
import { Navbar } from "@/app/components/layout/Navbar";
import { Footer } from "@/app/components/layout/Footer";
import {
  ArrowLeft, Globe, FileText, Users, Calendar,
  CheckCircle2, Send, AlertCircle, ExternalLink,
} from "lucide-react";
import { Project, ProjectMember } from "@/app/types/entities";
import { GitBranch } from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyErr, setApplyErr] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([projectsApi.getById(id), projectsApi.getMembers(id)])
      .then(([pRes, mRes]) => { setProject(pRes); setMembers(Array.isArray(mRes) ? mRes : []); })
      .catch(() => router.push("/projects"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const isOwner = !!user && project?.owner.id === user.id;
  const isMember = members.some((m) => m.id === user?.id);

  const handleApply = async () => {
    if (!id) return;
    setApplying(true);
    setApplyErr("");
    try {
      await projectsApi.apply(id, { message: message.trim() || undefined });
      setApplied(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApplyErr(msg ?? t.common.error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!project) return null;

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-[--brand]" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={14} /> {t.project.back}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-5">
            <div className="dc-card p-6 anim-fade-up">
              <div className="flex items-start gap-3 justify-between mb-4">
                <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight" style={{ color: "var(--text)" }}>
                  {project.title}
                </h1>
                <ProjectStatusBadge status={project.status} locale={locale} />
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-dim)" }}>
                <span className="flex items-center gap-1.5"><Calendar size={12} />{t.project.postedOn} {formatDate(project.createdAt, locale)}</span>
                <span className="flex items-center gap-1.5"><Users size={12} />{members.length} {t.projects.members}</span>
              </div>
            </div>

            <div className="dc-card p-6 anim-fade-up delay-1">
              <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>{t.project.about}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{project.description}</p>
            </div>

            {project.techStack?.length > 0 && (
              <div className="dc-card p-6 anim-fade-up delay-2">
                <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>{t.project.techStack}</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="font-mono text-xs px-3 py-1.5 rounded-lg border" style={{ color: "var(--accent)", borderColor: "color-mix(in srgb, var(--accent) 22%, transparent)", background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {members.length > 0 && (
              <div className="dc-card p-6 anim-fade-up delay-3">
                <h2 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>{t.project.team}</h2>
                <div className="space-y-3">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Avatar fullName={m.fullName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                          {m.fullName}
                          {m.id === project.owner.id && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: "color-mix(in srgb, var(--brand) 14%, transparent)", color: "var(--brand)" }}>owner</span>
                          )}
                        </p>
                        {m.role && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{m.role}</p>}
                      </div>
                      {m.skills.length > 0 && (
                        <div className="hidden sm:flex gap-1 flex-wrap justify-end">
                          {m.skills.slice(0, 3).map((s) => (
                            <span key={s} className="font-mono text-[10px] px-2 py-0.5 rounded" style={{ background: "var(--bg-overlay)", color: "var(--text-dim)" }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          
          <div className="lg:col-span-1 space-y-4">
            {isAuthenticated && !isOwner && (
              <div className="dc-card p-5 anim-fade-up delay-1">
                {isMember || applied ? (
                  <div className="py-2 text-center">
                    <CheckCircle2 size={30} className="mx-auto mb-2.5" style={{ color: "var(--success)" }} />
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {applied ? t.project.appliedSuccess : t.project.alreadyMember}
                    </p>
                    {applied && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{t.project.appliedSuccessSub}</p>}
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>{t.project.applyTitle}</h3>
                    {applyErr && (
                      <div className="flex items-center gap-2 p-3 rounded-xl border mb-4 text-xs" style={{ background: "color-mix(in srgb, var(--danger) 8%, transparent)", borderColor: "color-mix(in srgb, var(--danger) 20%, transparent)", color: "var(--danger)" }}>
                        <AlertCircle size={13} /> {applyErr}
                      </div>
                    )}
                    <label className="dc-label">
                      {t.project.applyMessageLabel}
                      <span className="text-xs ml-1" style={{ color: "var(--text-dim)" }}>({t.project.applyMessageHint})</span>
                    </label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} rows={4} placeholder={t.project.applyPlaceholder} className="dc-input resize-none mb-4" />
                    <button onClick={handleApply} disabled={applying} className="dc-btn-primary w-full py-2.5">
                      {applying ? <><Spinner size="sm" /> {t.common.loading}</> : <><Send size={14} /> {t.project.applyBtn}</>}
                    </button>
                  </>
                )}
              </div>
            )}

            {(project.repositoryUrl || project.demoUrl || project.docsUrl) && (
              <div className="dc-card p-5 anim-fade-up delay-2">
                <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>{t.project.links}</h3>
                <div className="space-y-2">
                  {[
                    { url: project.repositoryUrl, label: t.project.repository, icon: GitBranch, hoverColor: "var(--brand)" },
                    { url: project.demoUrl, label: t.project.demo, icon: Globe, hoverColor: "var(--accent)" },
                    { url: project.docsUrl, label: t.project.docs, icon: FileText, hoverColor: "var(--success)" },
                  ].filter(({ url }) => !!url).map(({ url, label, icon: Icon, hoverColor }) => (
                    <a key={label} href={url!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 group" style={{ borderColor: "var(--border)", background: "var(--bg-overlay)" }}>
                      <Icon size={15} style={{ color: "var(--text-muted)" }} />
                      <span className="text-sm flex-1 transition-colors group-hover:text-[--brand]" style={{ color: "var(--text-muted)", ["--brand" as string]: hoverColor }}>
                        {label}
                      </span>
                      <ExternalLink size={11} style={{ color: "var(--text-dim)" }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="dc-card p-5 anim-fade-up delay-3">
              <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text)" }}>{t.project.ownerLabel}</h3>
              <div className="flex items-center gap-3">
                <Avatar fullName={project.owner.fullName} size="md" />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{project.owner.fullName}</p>
                  <Link href={`/users/${project.owner.id}`} className="text-xs hover:underline" style={{ color: "var(--brand)" }}>
                    View profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="dc-skeleton h-4 w-28 rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="dc-card p-6">
                <div className="dc-skeleton h-6 w-2/3 rounded mb-4" />
                <div className="space-y-2">
                  <div className="dc-skeleton h-3 w-full rounded" />
                  <div className="dc-skeleton h-3 w-5/6 rounded" />
                  <div className="dc-skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="dc-card p-5">
                <div className="dc-skeleton h-4 w-1/2 rounded mb-4" />
                <div className="dc-skeleton h-20 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}



