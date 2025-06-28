import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contribution } from '@/types/contribution';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Trash2 } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

interface ContributionListProps {
    contributions: Contribution[];
    showActions?: boolean;
    showRecorder?: boolean;
    onDelete?: (contributionId: number) => void;
}

export function ContributionList({
    contributions,
    showActions = false,
    showRecorder = false,
    onDelete
}: ContributionListProps) {
    const handleDelete = (contributionId: number) => {
        if (confirm('Are you sure you want to delete this contribution?')) {
            router.delete(route('contributions.destroy', contributionId));
        }
    };

    if (contributions.length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                        <p>No contributions found.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contributions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            {showRecorder && <TableHead>Member</TableHead>}
                            {showRecorder && <TableHead>Recorded By</TableHead>}
                            <TableHead>Notes</TableHead>
                            {showActions && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contributions.map((contribution) => (
                            <TableRow key={contribution.id}>
                                <TableCell className="font-medium">
                                    {formatDate(contribution.date)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">
                                        {formatCurrency(contribution.amount)}
                                    </Badge>
                                </TableCell>
                                {showRecorder && (
                                    <TableCell>
                                        {contribution.user?.name}
                                        {contribution.user?.category && (
                                            <div className="text-xs text-muted-foreground">
                                                {contribution.user.category.name}
                                            </div>
                                        )}
                                    </TableCell>
                                )}
                                {showRecorder && (
                                    <TableCell>
                                        {contribution.recorded_by?.name}
                                    </TableCell>
                                )}
                                <TableCell>
                                    {contribution.notes ? (
                                        <span className="text-sm">{contribution.notes}</span>
                                    ) : (
                                        <span className="text-muted-foreground text-sm">—</span>
                                    )}
                                </TableCell>
                                {showActions && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={route('contributions.show', contribution.id)}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(contribution.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
