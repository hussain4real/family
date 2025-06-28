import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { User, Category } from '@/types/contribution';
import AppLayout from '@/layouts/app-layout';
import { CreateContributionForm } from '@/components/contributions/CreateContributionForm';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface CreateProps extends PageProps {
    users: User[];
    categories: Category[];
}

export default function Create({ users, categories }: CreateProps) {
    return (
        <AppLayout>
            <Head title="Record New Contribution" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('contributions.admin')}>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Admin
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold leading-tight text-gray-800">
                                    Record New Contribution
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Enter payment details for a family member
                                </p>
                            </div>

                            <CreateContributionForm
                                users={users}
                                categories={categories}
                                onSuccess={() => {
                                    // The form component handles redirect on success
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Recording Tips</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Select the family member who made the payment</li>
                            <li>• Choose the month the contribution is for</li>
                            <li>• Enter the exact amount received</li>
                            <li>• Add notes for any special circumstances</li>
                            <li>• Partial payments are allowed and will be tracked</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
