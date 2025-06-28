import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Contribution } from '@/types/contribution';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2, DollarSign, Calendar, User, FileText } from 'lucide-react';

interface ShowProps extends PageProps {
    contribution: Contribution;
    canEdit: boolean;
    canDelete: boolean;
}

export default function Show({ auth, contribution, canEdit, canDelete }: ShowProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this contribution? This action cannot be undone.')) {
            router.delete(route('contributions.destroy', contribution.id), {
                onSuccess: () => {
                    // Redirect is handled by the backend
                }
            });
        }
    };

    return (
        <AppLayout>
            <Head title={`Contribution #${contribution.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <Link href={route('contributions.index')}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Contributions
                            </Button>
                        </Link>

                        {(canEdit || canDelete) && (
                            <div className="flex gap-3">
                                {canEdit && (
                                    <Link href={route('contributions.edit', contribution.id)}>
                                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                )}
                                {canDelete && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Main Contribution Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Contribution Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <DollarSign className="h-4 w-4" />
                                                Amount
                                            </div>
                                            <div className="text-3xl font-bold text-green-600">
                                                {formatCurrency(contribution.amount)}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Calendar className="h-4 w-4" />
                                                Date Recorded
                                            </div>
                                            <div className="text-lg font-medium">
                                                {formatDate(contribution.date)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <User className="h-4 w-4" />
                                                Member
                                            </div>
                                            <div className="text-lg font-medium">
                                                {contribution.user?.name}
                                            </div>
                                            {contribution.user?.category && (
                                                <Badge variant="secondary" className="mt-1">
                                                    {contribution.user.category.name} - {formatCurrency(contribution.user.category.monthly_fee)}/month
                                                </Badge>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <User className="h-4 w-4" />
                                                Recorded By
                                            </div>
                                            <div className="text-lg font-medium">
                                                {contribution.recorded_by?.name || 'System'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {contribution.notes && (
                                    <div className="mt-6 pt-6 border-t">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <FileText className="h-4 w-4" />
                                            Notes
                                        </div>
                                        <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                            {contribution.notes}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Audit Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Audit Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Created:</span>
                                        <div className="font-medium">{formatDate(contribution.created_at)}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Last Updated:</span>
                                        <div className="font-medium">{formatDate(contribution.updated_at)}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Contribution ID:</span>
                                        <div className="font-medium">#{contribution.id}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Member ID:</span>
                                        <div className="font-medium">#{contribution.user_id}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Available Actions</h4>
                            <div className="flex gap-3">
                                <Link href={route('contributions.index')}>
                                    <Button variant="outline" size="sm">
                                        View All Contributions
                                    </Button>
                                </Link>
                                {auth.user && contribution.user && auth.user.id === contribution.user.id && (
                                    <Link href={route('contributions.index')}>
                                        <Button variant="outline" size="sm">
                                            My Contributions
                                        </Button>
                                    </Link>
                                )}
                                {canEdit && (
                                    <Link href={route('contributions.create')}>
                                        <Button size="sm">
                                            Record New Contribution
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
