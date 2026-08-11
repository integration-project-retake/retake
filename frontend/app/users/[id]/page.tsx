import { fetchUser } from '@/services/userService';
import { fetchReportsByUser } from '@/services/reportService';

import AvatarEditor from '@/components/AvatarEditor';
import UserReportsList from '@/components/UserReportsList';

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await fetchUser(id);
  const reports = await fetchReportsByUser(id);

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-6">
          <AvatarEditor
            profileId={Number(id)}
            currentAvatar={user.avatarUrl}
            username={user.username}
          />

          <h1 className="text-3xl font-bold transition-colors duration-200 hover:text-pink-500">
            {user.username}
          </h1>
        </div>

        <p className="mb-6 text-gray-400">
          {reports.length} reports contributed
        </p>

        <UserReportsList
          profileId={Number(id)}
          reports={reports}
        />
      </div>
    </main>
  );
}