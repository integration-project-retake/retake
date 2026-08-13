import { fetchUser } from '@/services/userService';
import { fetchReportsByUser } from '@/services/reportService';

import AvatarEditor from '@/components/AvatarEditor';
import UserReportsList from '@/components/UserReportsList';
import BioEditor from '@/components/BioEditor';

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await fetchUser(id);
  const reports = await fetchReportsByUser(id);

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <section className="relative mb-10 rounded-xl bg-gray-800 p-6 sm:p-8">
          <div className="flex items-start gap-6">
            {/* Avatar — fixed size, doesn't grow */}
            <div className="shrink-0">
              <AvatarEditor
                profileId={Number(id)}
                currentAvatar={user.avatarUrl}
                username={user.username}
              />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold transition-colors duration-200 hover:text-pink-500">
                {user.username}
              </h1>
              <div className="shrink-0 mt-4">
                <BioEditor profileId={Number(id)} currentBio={user.bio} />
              </div>
            </div>

          </div>
        </section>

        {/* Contribution count */}
        <p className="theme-secondary-text mb-6">
          {reports.length}{' '}
          {reports.length === 1
            ? 'report contributed'
            : 'reports contributed'}
        </p>

        {/* User reports */}
        <UserReportsList
          profileId={Number(id)}
          reports={reports}
        />
      </div>
    </main>
  );
}