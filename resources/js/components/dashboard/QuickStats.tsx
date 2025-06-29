import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { User } from '@/types';
import {DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface QuickStatsProps {
    summary: {
        total_collected: number;
        monthly_target: number;
        collection_rate: number;
        total_members: number;
        by_category: Array<{
            category: string;
            total_members: number;
            total_collected: number;
            monthly_fee: number;
        }>;
    };
    membersWithoutContribution: User[];
    currentMonth: string;
}

export function QuickStats({ summary, membersWithoutContribution, currentMonth }: QuickStatsProps) {
    const collectionPercentage = summary.monthly_target > 0
        ? (summary.total_collected / summary.monthly_target) * 100
        : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Collected */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summary.total_collected)}</div>
                    <p className="text-xs text-muted-foreground">
                        All time contributions
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
                        Expected per month
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
    );
}
