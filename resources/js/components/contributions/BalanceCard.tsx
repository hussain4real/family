import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserBalance, User } from '@/types/contribution';
import { formatCurrency } from '@/lib/utils';
// import { DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface BalanceCardProps {
    balance: UserBalance;
    user: User;
}

export function BalanceCard({ balance, user }: BalanceCardProps) {
    const getStatusColor = (status: UserBalance['status']) => {
        switch (status) {
            case 'up_to_date':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'behind_one_month':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'significantly_behind':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'no_category':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    const getStatusText = (status: UserBalance['status']) => {
        switch (status) {
            case 'up_to_date':
                return 'Up to Date';
            case 'behind_one_month':
                return 'Behind 1 Month';
            case 'significantly_behind':
                return 'Significantly Behind';
            case 'no_category':
                return 'No Category';
            default:
                return 'Unknown';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {user.name}'s Balance
                </CardTitle>
                <Badge className={getStatusColor(balance.status)}>
                    {getStatusText(balance.status)}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Monthly Fee</p>
                        <p className="text-2xl font-bold">{formatCurrency(balance.monthly_fee)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                        <p className={`text-2xl font-bold ${balance.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(balance.outstanding_balance)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Expected</p>
                        <p className="text-sm">{formatCurrency(balance.total_expected)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Paid</p>
                        <p className="text-sm">{formatCurrency(balance.total_paid)}</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        Months Due: {balance.months_due} | As of: {new Date(balance.as_of_date).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
