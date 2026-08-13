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


  const formatMemberSince = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      date,
    );

    return `${day} ${month} ${year}`;
  };

  const tierCounts = reports.reduce((acc, r) => {
    acc[r.tier] = (acc[r.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tierColors: Record<string, string> = {
    Platinum: 'bg-blue-200 text-blue-900',
    Gold: 'bg-yellow-400 text-yellow-900',
    Silver: 'bg-gray-300 text-gray-900',
    Bronze: 'bg-orange-500 text-orange-950',
    Borked: 'bg-red-600 text-white',
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <section className="theme-surface relative mb-10 rounded-xl bg-gray-800 p-6 sm:p-8">
          <div className="flex items-start gap-6">
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
                <span className="block text-base font-normal text-gray-400">
                  <p>Member Since</p>
                  <p>{formatMemberSince(user.createdAt)}</p>
                </span>
              </h1>
              <div className="shrink-0 mt-4">
                <BioEditor profileId={Number(id)} currentBio={user.bio} />
              </div>
            </div>

          </div>
        </section>
        <div className='flex flex-wrap gap-4'>
          <p className="theme-primary-text font-medium">
            {reports.length}{' '}
            {reports.length === 1
              ? 'report contributed'
              : 'reports contributed'}
          </p>

          {reports.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(tierCounts).map(([tier, count]) => (
              <span key={tier} className={`rounded-full px-3 py-1 text-sm font-semibold ${tierColors[tier]}`}>
                {tier}: {count}
              </span>
            ))}
          </div>
        ) : null}
        </div>
        {/* User reports */}
        <UserReportsList
          profileId={Number(id)}
          reports={reports}
        />
      </div>
    </main>
  );
}
