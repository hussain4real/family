import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from '@inertiajs/react';
import { AlertTriangle, Users, Mail, Plus } from 'lucide-react';
import { User } from '@/types';

interface MembersBehindAlertProps {
    members: User[] | any[];
    currentMonth: string;
}

export function MembersBehindAlert({ members, currentMonth }: MembersBehindAlertProps) {
    // Ensure members is an array
    const membersList = Array.isArray(members) ? members : [];

    if (membersList.length === 0) {
        return (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <CardTitle className="text-base text-green-800 dark:text-green-200">
                        All Members Up to Date
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        🎉 Excellent! All family members have contributed for {currentMonth}.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <CardTitle className="text-base text-amber-800 dark:text-amber-200">
                        Members Behind ({membersList.length})
                    </CardTitle>
                </div>
                <Link href={route('contributions.create')}>
                    <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-100">
                        <Plus className="h-3 w-3 mr-1" />
                        Record Payment
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <Alert className="border-amber-200 bg-amber-100/50 dark:border-amber-700 dark:bg-amber-900/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                        The following members haven't contributed for <strong>{currentMonth}</strong>:
                    </AlertDescription>
                </Alert>

                <div className="mt-4 space-y-3">
                    {membersList.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-white dark:border-amber-700 dark:bg-amber-950/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        {member.name.split(' ').map((n: string) => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-amber-900 dark:text-amber-100">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        {member.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {member.category && (
                                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 dark:border-amber-600 dark:text-amber-300">
                                        {member.category.name}
                                    </Badge>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-600 dark:hover:bg-amber-900"
                                    asChild
                                >
                                    <a href={`mailto:${member.email}`}>
                                        <Mail className="h-3 w-3" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {membersList.length > 3 && (
                    <div className="mt-3 text-center">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Consider sending gentle reminders to these members.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
