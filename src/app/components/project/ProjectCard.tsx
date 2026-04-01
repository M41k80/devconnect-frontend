import { useI18n } from "@/app/i18n";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { ProjectCardTechStack } from "./ProjectCardtECHstack";
import { ProjectCardFooter } from "./ProjectCardFooter";
import { Link } from "lucide-react";
import { cn, truncate } from "@/app/lib/utils";
import { Project } from "@/app/types/entities";
import type { CSSProperties } from "react";

export interface ProjectCardProps {
  project: Project & { score?: number };
  className?: string;
  style?: CSSProperties;
}

export function ProjectCard({ project, className, style }: ProjectCardProps) {
  const { locale } = useI18n();

  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        "dc-card-interactive flex flex-col p-5 no-underline",
        className,
      )}
      style={style}
    >
      <ProjectCardHeader
        title={project.title}
        status={project.status}
        locale={locale}
      />
      <p
        className="text-xs leading-relaxed mb-4 flex-1"
        style={{ color: "var(--text-muted)" }}
      >
        {truncate(project.description, 115)}
      </p>
      <ProjectCardTechStack techStack={project.techStack} />
      <ProjectCardFooter
        owner={project.owner}
        score={project.score}
        createdAt={project.createdAt}
        locale={locale}
      />
    </Link>
  );
}
