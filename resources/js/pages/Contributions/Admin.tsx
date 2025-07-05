import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ContributionSummary, Contribution, User, Category } from '@/types/contribution';
import AppLayout from '@/layouts/app-layout';
import { SummaryCards, CategoryBreakdown } from '@/components/contributions/SummaryCards';
import { ContributionList } from '@/components/contributions/ContributionList';
import { CreateContributionForm } from '@/components/contributions/CreateContributionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from '@inertiajs/react';
import { Plus, Users, Banknote } from 'lucide-react';

interface ResourceCollection<T> {
    data: T[];
}

interface AdminProps extends PageProps {
    summary: ContributionSummary;
    recentContributions?: Contribution[];
    users?: User[] | ResourceCollection<User>;
    categories?: Category[];
}

export default function Admin({ summary, recentContributions, users, categories }: AdminProps) {
    // Extract the actual users array from the ResourceCollection
    const usersData: User[] = Array.isArray(users) ? users : (users as ResourceCollection<User>)?.data || [];
    const categoriesData = categories || [];

    return (
        <AppLayout>
            <Head title="Financial Administration" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Page Header */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-semibold leading-tight text-gray-800">
                                        Financial Administration
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Manage family contributions and view financial overview
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Link href={route('contributions.create')}>
                                        <Button className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Record Contribution
                                        </Button>
                                    </Link>
                                    <Link href={route('contributions.index')}>
                                        <Button variant="outline" className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4" />
                                            My Contributions
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <SummaryCards summary={summary} />

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="record">Record Payment</TabsTrigger>
                            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                            <TabsTrigger value="members">Members</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <CategoryBreakdown summary={summary} />

                            {summary.recent_contributions.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Latest Contributions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ContributionList
                                            contributions={summary.recent_contributions.slice(0, 5)}
                                            showRecorder={true}
                                            showActions={true}
                                        />
                                        {summary.recent_contributions.length > 5 && (
                                            <div className="mt-4 text-center">
                                                <Link href={route('contributions.index')}>
                                                    <Button variant="outline" size="sm">
                                                        View All Contributions
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="record">
                            {Array.isArray(usersData) && usersData.length > 0 && Array.isArray(categoriesData) && categoriesData.length > 0 ? (
                                <CreateContributionForm
                                    users={usersData}
                                    categories={categoriesData}
                                    onSuccess={() => {
                                        // Optionally refresh data or show success message
                                    }}
                                />
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Loading form data...</p>
                                    <p className="text-sm mt-2">Please wait while we load the member information.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="recent">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentContributions && recentContributions.length > 0 ? (
                                        <ContributionList
                                            contributions={recentContributions}
                                            showRecorder={true}
                                            showActions={true}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No recent contributions</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="members">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Family Members
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        {usersData && usersData.length > 0 ? usersData.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-sm font-medium">
                                                            {user.name.split(' ').map((n) => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{user.name}</h4>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">
                                                        {user.category?.name || 'No category'}
                                                    </div>
                                                    {user.category && (
                                                        <div className="text-sm text-muted-foreground">
                                                            ${user.category.monthly_fee}/month
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>No members found</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
