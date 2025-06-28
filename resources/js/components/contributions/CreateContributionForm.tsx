import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Category } from '@/types/contribution';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, DollarSign } from 'lucide-react';

interface CreateContributionFormProps {
    users?: User[];
    categories?: Category[];
    onSuccess?: () => void;
}

export function CreateContributionForm({ users = [], categories = [], onSuccess }: CreateContributionFormProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        amount: '',
        contribution_month: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('contributions.store'), {
            onSuccess: () => {
                reset();
                setSelectedUser(null);
                onSuccess?.();
            },
        });
    };

    const handleUserChange = (userId: string) => {
        setData('user_id', userId);
        const user = Array.isArray(users) ? users.find(u => u.id.toString() === userId) : null;
        setSelectedUser(user || null);
    };

    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    // Show loading state if data is not available
    if (!Array.isArray(users) || users.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Record New Contribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Loading form data...</p>
                        <p className="text-sm mt-2">Please wait while we load the member information.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Record New Contribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="user_id">Member</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={handleUserChange}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(users) && users.length > 0 ? (
                                        users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{user.name}</span>
                                                    <span className="text-sm text-muted-foreground ml-2">
                                                        ({user.category?.name})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="" disabled>
                                            No users available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.user_id && (
                                <p className="text-sm text-red-600">{errors.user_id}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contribution_month">Month</Label>
                            <Input
                                id="contribution_month"
                                type="month"
                                value={data.contribution_month}
                                onChange={(e) => setData('contribution_month', e.target.value)}
                                defaultValue={getCurrentMonth()}
                                required
                                className="w-full"
                            />
                            {errors.contribution_month && (
                                <p className="text-sm text-red-600">{errors.contribution_month}</p>
                            )}
                        </div>
                    </div>

                    {selectedUser && (
                        <Alert>
                            <AlertDescription>
                                Selected member: <strong>{selectedUser.name}</strong>
                                {selectedUser.category && (
                                    <span className="ml-2">
                                        ({selectedUser.category.name} - {formatCurrency(selectedUser.category.monthly_fee)}/month)
                                    </span>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="pl-9"
                                required
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-sm text-red-600">{errors.amount}</p>
                        )}
                        {selectedUser?.category && (
                            <p className="text-sm text-muted-foreground">
                                Expected monthly contribution: {formatCurrency(selectedUser.category.monthly_fee)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            placeholder="Additional notes..."
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-600">{errors.notes}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="flex-1">
                            {processing ? 'Recording...' : 'Record Contribution'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                setSelectedUser(null);
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
