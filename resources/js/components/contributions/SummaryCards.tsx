import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContributionSummary } from '@/types/contribution';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
    summary: ContributionSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Collected
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(summary.total_collected)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Period: {new Date(summary.period.start).toLocaleDateString()} - {new Date(summary.period.end).toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Outstanding
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(summary.total_outstanding)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Across all members
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Categories
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.by_category.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {summary.by_category.reduce((sum, cat) => sum + cat.total_members, 0)} total members
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Recent Activity
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary.recent_contributions.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Recent contributions
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export function CategoryBreakdown({ summary }: SummaryCardsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {summary.by_category.map((category) => (
                        <div
                            key={category.category}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{category.category}</h4>
                                    <Badge variant="secondary">
                                        {formatCurrency(category.monthly_fee)}/month
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {category.total_members} member{category.total_members !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                    {formatCurrency(category.total_collected)}
                                </div>
                                {category.total_outstanding > 0 && (
                                    <div className="text-sm text-red-600">
                                        {formatCurrency(category.total_outstanding)} outstanding
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
