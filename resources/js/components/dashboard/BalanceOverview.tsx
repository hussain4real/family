import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, HandCoins, Currency } from 'lucide-react';

interface BalanceOverviewProps {
    balance: {
        outstanding_balance: number;
        months_behind: number;
        total_paid: number;
        total_expected: number;
        is_up_to_date: boolean;
    };
    category?: {
        name: string;
        monthly_fee: number;
    };
}

export function BalanceOverview({ balance, category }: BalanceOverviewProps) {
    const progressPercentage = balance.total_expected > 0
        ? Math.min((balance.total_paid / balance.total_expected) * 100, 100)
        : 100;

    const getStatusColor = () => {
        if (balance.is_up_to_date) return 'text-green-600 dark:text-green-400';
        if (balance.months_behind <= 1) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getStatusIcon = () => {
        if (balance.is_up_to_date) return <TrendingUp className="h-4 w-4" />;
        if (balance.months_behind <= 1) return <AlertTriangle className="h-4 w-4" />;
        return <TrendingDown className="h-4 w-4" />;
    };

    const getStatusText = () => {
        if (balance.is_up_to_date) return 'Up to date';
        if (balance.months_behind === 1) return '1 month behind';
        if (balance.months_behind > 1) return `${balance.months_behind} months behind`;
        return 'Up to date'; // fallback for 0 or undefined months_behind
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contribution Status</CardTitle>
                <Currency className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 ${getStatusColor()}`}>
                            {getStatusIcon()}
                            <span className="text-sm font-medium">{getStatusText()}</span>
                        </div>
                        {category && (
                            <Badge variant="outline" className="text-xs">
                                {category.name}
                            </Badge>
                        )}
                    </div>

                    {/* Outstanding Balance */}
                    <div>
                        <div className="text-2xl font-bold">
                            {balance.outstanding_balance > 0 ? (
                                <span className="text-red-600 dark:text-red-400">
                                    -{formatCurrency(balance.outstanding_balance)}
                                </span>
                            ) : (
                                <span className="text-green-600 dark:text-green-400">
                                    {formatCurrency(0)}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {balance.outstanding_balance > 0 ? 'Outstanding balance' : 'All caught up!'}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Paid: {formatCurrency(balance.total_paid)}</span>
                            <span>Expected: {formatCurrency(balance.total_expected)}</span>
                        </div>
                    </div>

                    {/* Monthly Fee */}
                    {category && (
                        <div className="pt-2 border-t">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Monthly contribution</span>
                                <span className="font-medium">{formatCurrency(category.monthly_fee)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
