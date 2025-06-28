import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { User, UserBalance, Contribution } from '@/types/contribution';
import AppLayout from '@/layouts/app-layout';
import { BalanceCard } from '@/components/contributions/BalanceCard';
import { ContributionList } from '@/components/contributions/ContributionList';

interface IndexProps extends PageProps {
    balance: UserBalance;
    contributions: Contribution[];
}

export default function Index({ auth, balance, contributions }: IndexProps) {
    return (
        <AppLayout>
            <Head title="My Contributions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-6">
                            {/* Page Header */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold leading-tight text-gray-800">
                                    My Contributions
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    View your contribution history and account balance
                                </p>
                            </div>

                            {/* Balance Overview */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-4">Account Overview</h3>
                                <BalanceCard balance={balance} user={auth.user} />
                            </div>

                            {/* Contributions History */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Contribution History</h3>
                                    {contributions.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            {contributions.length} contribution{contributions.length !== 1 ? 's' : ''} recorded
                                        </p>
                                    )}
                                </div>

                                {contributions.length > 0 ? (
                                    <ContributionList
                                        contributions={contributions}
                                        showRecorder={false}
                                        showActions={false}
                                    />
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border">
                                        <p className="text-gray-600 mb-2">No contributions recorded yet</p>
                                        <p className="text-sm text-gray-500">
                                            Your contributions will appear here once they are recorded by the financial secretary.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Information Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">Information</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Your monthly contribution amount is based on your category: {auth.user.category?.name}</li>
                                    <li>• Contact the financial secretary if you have questions about your contributions</li>
                                    <li>• Your balance is calculated from the start of your membership</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
