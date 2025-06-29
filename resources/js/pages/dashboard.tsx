import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MembersBehindAlert } from '@/components/dashboard/MembersBehindAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canAccessAdmin } from '@/lib/permissions';
import { PageProps, type BreadcrumbItem, User } from '@/types';
import { Contribution, ContributionSummary } from '@/types/contribution';
import { usePage } from '@inertiajs/react';
import { Calendar, TrendingUp } from 'lucide-react';

interface DashboardProps extends PageProps {
    user: User;
    balance: {
        outstanding_balance: number;
        months_behind: number;
        total_paid: number;
        total_expected: number;
        is_up_to_date: boolean;
    };
    recentContributions: Contribution[];
    category?: {
        id: number;
        name: string;
        monthly_fee: number;
    };
    adminData?: {
        summary: ContributionSummary;
        allRecentContributions: Contribution[];
        membersWithoutContribution: User[];
        currentMonth: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    user,
    balance,
    recentContributions,
    category,
    adminData
}: DashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const isAdmin = canAccessAdmin(auth);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6 px-0 md:px-6 lg:px-8 py-0 md:py-6 lg:py-8">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-muted-foreground">
                            {isAdmin
                                ? "Here's an overview of family contributions and your financial secretary dashboard."
                                : "Here's your contribution status and recent activity."
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Admin Stats (if admin) */}
                {isAdmin && adminData && (
                    <QuickStats
                        summary={adminData.summary}
                        membersWithoutContribution={adminData.membersWithoutContribution}
                        currentMonth={adminData.currentMonth}
                    />
                )}

                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Personal Balance Overview */}
                    <div className="md:col-span-1">
                        <BalanceOverview balance={balance} category={category} />
                    </div>

                    {/* Recent Personal Activity */}
                    <div className="md:col-span-1 lg:col-span-2">
                        <RecentActivity
                            contributions={recentContributions}
                            title="Your Recent Contributions"
                            emptyMessage="You haven't made any contributions yet"
                            viewAllRoute={route('contributions.index')}
                        />
                    </div>
                </div>

                {/* Admin Section */}
                {isAdmin && adminData && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-semibold">Financial Secretary Dashboard</h2>
                        </div>

                        {/* Members Behind Alert */}
                        <MembersBehindAlert
                            members={adminData.membersWithoutContribution}
                            currentMonth={adminData.currentMonth}
                        />

                        {/* All Recent Activity */}
                        <RecentActivity
                            contributions={adminData.allRecentContributions}
                            title="All Recent Contributions"
                            emptyMessage="No contributions recorded yet"
                            viewAllRoute={route('contributions.admin')}
                            showCreateButton={true}
                            isAdmin={true}
                        />
                    </div>
                )}

                {/* Quick Actions for Non-Admin */}
                {!isAdmin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Need to make a contribution or have questions?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Contact your financial secretary for assistance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
