import Photo from "@/components/Photo";
import { CheckIcon } from "@/components/icons";
import { AVATAR_IMAGE, PROFILE_NAME } from "@/lib/site";

export default function ProfilePanel() {
  return (
    <div className="flex flex-col gap-4">
      <span className="label">Profile</span>
      <div className="flex items-center gap-3">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-line bg-surface">
          <Photo src={AVATAR_IMAGE} alt="" sizes="48px" className="object-top" />
        </div>
        <div className="min-w-0">
          <p className="text-[17px] font-medium tracking-[-0.02em]">{PROFILE_NAME}</p>
          <p className="text-[13px] text-muted">Personal avatar</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-[13px]">
        <div className="rounded-2xl border border-line px-3 py-2.5">
          <dt className="label mb-1.5">Soul ID</dt>
          <dd className="flex items-center gap-1.5 text-text">
            <span className="flex size-4 items-center justify-center rounded-full bg-accent/15 text-accent">
              <CheckIcon width={11} height={11} strokeWidth={2} />
            </span>
            Ready
          </dd>
        </div>
        <div className="rounded-2xl border border-line px-3 py-2.5">
          <dt className="label mb-1.5">Model</dt>
          <dd className="text-text">Soul V2</dd>
        </div>
      </dl>
    </div>
  );
}
