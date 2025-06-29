import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContributionList } from '@/components/contributions/ContributionList';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Plus, ArrowRight, Activity } from 'lucide-react';
import { Contribution } from '@/types/contribution';

interface RecentActivityProps {
    contributions: Contribution[] | any[];
    showCreateButton?: boolean;
    title?: string;
    emptyMessage?: string;
    viewAllRoute?: string;
    isAdmin?: boolean;
}

export function RecentActivity({
    contributions,
    showCreateButton = false,
    title = "Recent Contributions",
    emptyMessage = "No recent contributions",
    viewAllRoute,
    isAdmin = false
}: RecentActivityProps) {
    // Ensure contributions is an array
    const contributionsList = Array.isArray(contributions) ? contributions : [];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    {showCreateButton && (
                        <Link href={route('contributions.create')}>
                            <Button size="sm" className="flex items-center gap-1">
                                <Plus className="h-3 w-3" />
                                Record
                            </Button>
                        </Link>
                    )}
                    {viewAllRoute && (
                        <Link href={viewAllRoute}>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                View All
                                <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {contributionsList.length > 0 ? (
                    <div className="space-y-3">
                        <ContributionList
                            contributions={contributionsList}
                            showRecorder={isAdmin}
                            showActions={false}
                        />
                        {contributionsList.length >= 5 && (
                            <div className="pt-2 border-t text-center">
                                <p className="text-sm text-muted-foreground">
                                    Showing latest {contributionsList.length} contributions
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{emptyMessage}</p>
                        {showCreateButton && (
                            <Link href={route('contributions.create')} className="mt-2 inline-block">
                                <Button size="sm" variant="outline">
                                    Record First Contribution
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
