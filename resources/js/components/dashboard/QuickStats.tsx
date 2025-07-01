import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { User } from '@/types';
import { TrendingUp, AlertTriangle, Banknote } from 'lucide-react';

interface QuickStatsProps {
    summary: {
        total_collected: number;
        total_outstanding: number;
        monthly_target: number;
        collection_rate: number;
        total_members: number;
        by_category: Array<{
            category: string;
            total_members: number;
            total_collected: number;
            total_outstanding: number;
            monthly_fee: number;
        }>;
        period: {
            start: string;
            end: string;
        };
    };
    membersWithoutContribution: User[];
    currentMonth: string;
}

export function QuickStats({ summary, membersWithoutContribution, currentMonth }: QuickStatsProps) {
    const collectionPercentage = summary.monthly_target > 0
        ? (summary.total_collected / summary.monthly_target) * 100
        : 0;

    // Calculate overall statistics
    const overallExpected = summary.by_category.reduce((total, category) => {
        return total + (category.total_members * category.monthly_fee);
    }, 0);

    const overallCollected = summary.by_category.reduce((total, category) => {
        return total + category.total_collected;
    }, 0);

    return (
        <div className="space-y-6">
            {/* Current Month Statistics */}
            <div>
                <h3 className="text-lg font-medium mb-4">Current Month ({currentMonth})</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Monthly Collected */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Collected</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.total_collected)}</div>
                            <p className="text-xs text-muted-foreground">
                                This month's contributions
                            </p>
                        </CardContent>
                    </Card>

                    {/* Monthly Target */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(summary.monthly_target)}</div>
                            <p className="text-xs text-muted-foreground">
                                Expected this month
                            </p>
                        </CardContent>
                    </Card>

                    {/* Collection Rate */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <span className={collectionPercentage >= 100 ? 'text-green-600' : 'text-yellow-600'}>
                                    {Math.round(collectionPercentage)}%
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {currentMonth} target
                            </p>
                        </CardContent>
                    </Card>

                    {/* Members Behind */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Members Behind</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <span className={membersWithoutContribution.length === 0 ? 'text-green-600' : 'text-red-600'}>
                                    {membersWithoutContribution.length}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Haven't paid {currentMonth.split(' ')[0]}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Overall Statistics */}
            <div>
                <h3 className="text-lg font-medium mb-4">Overall Statistics</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Outstanding */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <span className={summary.total_outstanding === 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatCurrency(summary.total_outstanding)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total owed by all members
                            </p>
                        </CardContent>
                    </Card>

                    {/* All-Time Collected */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">All-Time Collected</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(overallCollected)}</div>
                            <p className="text-xs text-muted-foreground">
                                Total contributions ever
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Members */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_members}</div>
                            <p className="text-xs text-muted-foreground">
                                Active family members
                            </p>
                        </CardContent>
                    </Card>

                    {/* Overall Performance */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <span className={summary.total_outstanding === 0 ? 'text-green-600' : summary.total_outstanding < summary.monthly_target ? 'text-yellow-600' : 'text-red-600'}>
                                    {summary.total_outstanding === 0 ? '✓' : '!'}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {summary.total_outstanding === 0 ? 'All caught up' : 'Some outstanding'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
