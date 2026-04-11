"use client";

import { useState, useEffect } from "react";
import { Edit2, X, MapPin, Calendar, Globe } from "lucide-react";
import { useI18n } from "@/app/i18n";
import { useAuthStore } from "@/app/store/auth.store";
import { ProjectApplication } from "@/app/types/entities";
import { UpdateUserDto } from "@/app/types/dtos";
import { projectsApi, usersApi } from "@/app/lib/api";
import { Navbar } from "@/app/components/layout/Navbar";
import { Avatar } from "@/app/components/ui/Avatar";
import { formatDate } from "@/app/lib/utils";
import { SlSocialLinkedin } from "react-icons/sl";
import { SiGithub } from "react-icons/si";
import { Footer } from "@/app/components/layout/Footer";

export default function ProfilePage() {
  const { t, locale } = useI18n();
  const { user, fetchMe } = useAuthStore();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [apps, setApps] = useState<ProjectApplication[]>([]);
  const [appsLoad, setAppsLoad] = useState(true);

  const [form, setForm] = useState<Required<UpdateUserDto>>({
    fullName: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
    portfolio: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? "",
        bio: user.bio ?? "",
        location: user.location ?? "",
        github: user.github ?? "",
        linkedin: user.linkedin ?? "",
        portfolio: user.portfolio ?? "",
        profileImageUrl: user.profileImageUrl ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    projectsApi
      .getApplied()
      .then((res) => setApps(res))
      .finally(() => setAppsLoad(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveErr("");
    try {
      const payload: UpdateUserDto = {};

      if (form.fullName) payload.fullName = form.fullName;
      if (form.bio) payload.bio = form.bio;
      if (form.location) payload.location = form.location;
      if (form.github) payload.github = form.github;
      if (form.linkedin) payload.linkedin = form.linkedin;
      if (form.portfolio) payload.portfolio = form.portfolio;
      if (form.profileImageUrl) payload.profileImageUrl = form.profileImageUrl;

      await usersApi.updateProfile(payload);
      await fetchMe();
      setEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSaveErr(err.message);
      } else {
        setSaveErr(t.common.error);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-5">
            <div className="dc-card p-6 text-center anim-fade-up">
              <Avatar
                fullName={user.fullName}
                profileImageUrl={user.profileImageUrl}
                size="xl"
                className="mx-auto mb-4"
              />

              <h1 className="font-display text-xl font-bold mb-1">
                {user.fullName}
              </h1>

              {user.professionalRole && (
                <p className="text-sm mb-3 text-[--brand]">
                  {user.professionalRole.name}
                </p>
              )}

              {user.bio && (
                <p className="text-sm mb-4 text-[--text-muted]">{user.bio}</p>
              )}

              <div className="space-y-2 text-left mt-3">
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-[--text-muted]">
                    <MapPin size={13} />
                    {user.location}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-[--text-muted]">
                  <Calendar size={13} />
                  {t.profile.memberSince} {formatDate(user.createdAt, locale)}
                </div>
              </div>

              {(user.github || user.linkedin || user.portfolio) && (
                <div className="flex gap-3 mt-5 pt-5 border-t">
                  {user.github && (
                    <a href={user.github} target="_blank">
                      <SiGithub size={15} />
                    </a>
                  )}
                  {user.linkedin && (
                    <a href={user.linkedin} target="_blank">
                      <SlSocialLinkedin size={15} />
                    </a>
                  )}
                  {user.portfolio && (
                    <a href={user.portfolio} target="_blank">
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={() => setEditing(true)}
                className="dc-btn-ghost w-full mt-5"
              >
                <Edit2 size={13} /> {t.profile.editProfile}
              </button>
            </div>

            {user.skills?.length > 0 && (
              <div className="dc-card p-5">
                <h3 className="font-semibold text-sm mb-3">
                  {t.profile.skillsLabel}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {user.skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs border px-2 py-1 rounded"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {editing && (
              <div className="dc-card p-6">
                <div className="flex justify-between mb-4">
                  <h2>{t.profile.editProfile}</h2>
                  <button onClick={() => setEditing(false)}>
                    <X size={16} />
                  </button>
                </div>

                {saveErr && <p className="text-red-500 text-sm">{saveErr}</p>}

                <div className="grid gap-3">
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    placeholder="Full name"
                    className="dc-input"
                  />

                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="Location"
                    className="dc-input"
                  />

                  <input
                    value={form.github}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, github: e.target.value }))
                    }
                    placeholder="GitHub"
                    className="dc-input"
                  />

                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bio: e.target.value }))
                    }
                    placeholder="Bio"
                    className="dc-input"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={handleSave} className="dc-btn-primary">
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="dc-btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div>
              {appsLoad ? (
                <div>Loading applications...</div>
              ) : apps.length === 0 ? (
                <div>No applications</div>
              ) : (
                apps.map((app) => <div key={app.id}>{app.project?.title}</div>)
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
